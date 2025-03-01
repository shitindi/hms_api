const {User: Users} = require('../models/Auth/User');
const { Op } = require('sequelize')

const {logData} = require('../helpers/logger')
const { LoginAttempt } = require('../models/LoginAttempt')
const { ActiveSession } = require('../models/ActiveSession')
const { SessionHistory} = require('../models/SessionHistory')

const createError = require('http-errors');
const {authSchema, passUpdate} = require('../helpers/validation_schema')
const  hash = require('../helpers/hash_data')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');
//const client = require('../helpers/init_redis');

const {getRandomString} = require('../helpers/code_generator')
const {ActivationCode: ActivationCodes} = require('../models/Auth/ActivationCode')
const {encryptSymmetric: encryp, decryptSymmetric: decrypt} = require('./helpers/cryptography')
const {sendMail} = require('../helpers/mailing')


const register = async (req, res, next) => {

    try {
     
        // Validate request data
        const user = await authSchema.validateAsync(req.body);   //This will throw error which will be catched in catch block

        
        // Check user if exists
        let User = await Users.findOne({
            where: { email: user.email }
        }
        );

        if (User) throw createError.Conflict(`${user.email} is already been registered`)

        user.password = await hash.hashPassword(user.password)

        Users.create(user)
        
        .then( async result =>  {
            const accessToken = await signAccessToken(result.id)
            const refreshToken = await signRefreshToken(result.id)

            //Create email verification link
            generateVerificationEmail(result.id, user.email, user.email)

            res.status(201).json({
                message: "User created successfully",
                accessToken,
                refreshToken,
                data:result
            })
        }).catch(error => {
            logData('register: ' + error)
            res.status(500).json({
                message: "something went wrong",
                error:error
            })
        }) 

    } catch (error) {
        if (error.isJoi === true) error.status = 422
        next(error)
    }
}

const generateVerificationEmail = async (userId, email, name) => {
    try{
        // Generate tokens to be inserted into
        const token = getRandomString(64)
        const activationCode = {
            user_id: userId,
            activation_type: 1,
            user_token: token
    }

    ActivationCodes.destroy({where: {user_id: userId}})

    await ActivationCodes.create(activationCode);

    let tokenJson = {
        user_id: userId,
        token: token
    }
    
    tokenText = JSON.stringify(tokenJson)
        
    const key =  process.env.CRYPTOGRAPHY_SECRET
    const serviceUrl = process.env.MAIL_ACTIVATION_URL
    
    const crypoData =  encryp(key, tokenText)
    
    const mailToken = {
        referer: crypoData.ciphertext,
        nonce: crypoData.iv,
        tag: crypoData.tag
    }
    
    const tokenString = JSON.stringify(mailToken)
    
    console.log('token stry: ', tokenString);
    
    
    const tokenToBase64 = Buffer.from(tokenString).toString('base64')

    const activationLink = `${serviceUrl}?lnk=${tokenToBase64}`

    sendMail(email, name, activationLink)
    
    }catch(err){
        logData('generateVerificationEmail: ' + err)
    }
}

const  verifyEmail = async (req, res, next) => {

    try{
        const key =  process.env.CRYPTOGRAPHY_SECRET

        const tokenBase64 = req.query.lnk;
        const tokenFromBase64 = Buffer.from(tokenBase64, 'base64').toString('ascii')

        const cryptoObj = JSON.parse(tokenFromBase64)
        const plaintext = decrypt(key, cryptoObj.referer, cryptoObj.nonce, cryptoObj.tag);

        const tokenObj =   JSON.parse(plaintext)

        const ActCode = ActivationCodes.findOne({
            where: {[Op.and]: {user_id: tokenObj.user_id, user_token: tokenObj.user_token}}
        })

        if(!ActCode){
            throw createError.NotFound("Activation link is not valid")
        }

        const User = Users.findOne({
            where: {id: tokenObj.user_id}
        })

        if (!User){
            throw createError.NotFound("Activation link is not valid") 
        }

        let eventTime = new Date().toISOString().replace('T', ' ').split('.')[0];

        User.email_verified = true
        User.is_active = true
        User.activated_date=eventTime

        Users.update(User, {
            where: {id:tokenObj.user_id}, fields: ['email_verified', 'is_active', 'activated_date']
        })
        res.status(200).json({
            message: "Email verified successfully",
        })
    }catch(err){
        logData('verifyEmail: ' + err)
    }
}

const login = async (req, res, next) => {
    try{
        const login = await authSchema.validateAsync(req.body); 

        // Check user if exists
        let User = await Users.findOne({
            where: { email: login.email }
        }
        );

        if( !User){
           await logLoginAttempt(null, login.email, req.ip , false)

           //increment login attempt fails, usefull for account lock feature
           Users.increment( {retry_count: +1}, {where: {id: User.id}})
            throw createError.NotFound("User not registered")
        }

        const isMatch = await hash.isPasswordmatch(login.password, User.password)

        await logLoginAttempt(User.id, login.email, req.ip , isMatch)

        if (!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(User.id)
        const refreshToken = await signRefreshToken(User.id)

        //reset user login retry count
        User.retry_count = 0;
        Users.update(
            User, {where: {id:User.id}, fields:['retry_count']}
        );

        await logSessionData(User.id, req.ip, accessToken, refreshToken);

        res.status(200).json({
            message: "Logged in successfully",
            accessToken,
            refreshToken
        })
    } catch(error){
        if (error.isJoi) return next(createError.BadRequest("invalid Username/Password"))
        next(error)
    }
}

const changePassword = async (req, res, nex) => {
    try{
        const login = await passUpdate.validateAsync(req.body); 

        let User = await Users.findOne({
            where: { email: login.email }
        }
        );

        if( !User){
            throw createError.NotFound("User not registered")
        }

        const isMatch = await hash.isPasswordmatch(login.password, User.password)

        if(!isMatch){
            throw createError.NotFound("User not registered")
        }

        User.password =  await hash.hashPassword(login.newPassword)
        User.retry_count = 0
        User.must_change_password = false

        Users.update(User, {where :{id: User.id}, fields: ['password', 'retry_count', 'must_change_password']})

    }catch(error){
        logData('changePassword: ' + error)
    }
}

const refresh = async (req, res, next) => {
    try{
        const { refreshToken } = req.body
        if( !refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        
        //Generate a pair of refresh and access tokens
        const accessToken = await signAccessToken(userId)
        const newRefreshToken = await signRefreshToken(userId)

        let session = ActiveSession.findOne({
            where: {[Op.and] : {user_id: userId, refresh_token: refreshToken}}
        })
        
        if (!session){
            return reject(createError.Unauthorized()) 
        }
        session.user_token = accessToken
        session.refresh_token = newRefreshToken
        session.user_ip = req.ip
        ActiveSession.update(session, {where: {user_id:userId}, fields: ['user_token','refresh_token', 'user_ip']})

         res.send({accessToken, refreshToken: newRefreshToken})
    }catch(error){
        next(error)
    }
}

const logout = async (req, res, next) => {
    try{

        const { refreshToken } = req.body
        if(!refreshToken) throw createError.BadGateway()
        
        const userId = await verifyRefreshToken(refreshToken)

        await destroySession(userId);

        res.sendStatus(204);

        /*
        client.DEL(userId.toString())
        .then(val => {
            res.sendStatus(204)
        })
        .catch( err => {
            logData('logout: ' + err)
            throw createError.InternalServerError()
        })
            */
    }catch(error){
        next(error)
    }
}

const logLoginAttempt = async (userId, loginName, userIp, isSuccess) =>{

 let logData =    {
       user_id: userId,
       login_name: loginName,
       is_success: isSuccess,
       client_ip: userIp
    }

   try{
     await LoginAttempt.create(logData);
   }catch(error){
        logData('Login Attempt: ' + error);
   }
}

const logSessionData = async (userId, userIp, userToken, refreshToken) => {
    let eventTime = new Date().toISOString().replace('T', ' ').split('.')[0];

  let SessionData =    { user_id: userId,
       loggin_date: eventTime,
       refresh_date: eventTime,
       user_ip: userIp,
       is_active: true,
       voluntary_logout: 0,
       user_token: userToken,
       refresh_token: refreshToken
    }

    try{
        let activeSession = ActiveSession.findOne({
            where: {id: userId}
        })

        if (activeSession){
            await destroySession(userId);
        }

        await ActiveSession.create(SessionData)
    }catch(error){
        logData('Create Session Data: ' + error)
    }
}

const destroySession = async( userId) => {

    let SessionData = await ActiveSession.findOne({
        where: { id: userId }
    }
    );

    if( !SessionData){
        throw createError.NotFound("Cannot logout invalid user")
    }

    let transaction;
    try {
    // start a new transaction
    transaction = await sequelize.transaction();

    // run queries, pass in transaction
    await Promise.all([

        SessionHistory.create(SessionData, {transaction}),

        ActiveSession.destroy({where: {user_id: SessionData.user_id}}, {transaction})
    ]
    );

    await transaction.commit();

    } catch (err) {
    // if we got an error and we created the transaction, roll it back
    if (transaction) {
        await transaction.rollback();
    }
        logData('destroySession: ' + err );
    }

}


module.exports = {
    register,
    login,
    changePassword,
    refresh,
    logout
}