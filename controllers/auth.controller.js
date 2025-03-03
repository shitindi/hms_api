const {User: Users, createUserObject} = require('../models/Auth/User');
const {Contact: Contacts, createContactObject} = require('../models/Auth/Contact')
const { Op } = require('sequelize')

const {logData} = require('../helpers/logger')
const { LoginAttempt } = require('../models/Auth/LoginAttempt')
const { ActiveSession } = require('../models/Auth/ActiveSession')
const { SessionHistory} = require('../models/Auth/SessionHistory')
const {PasswordHistory} = require('../models/Auth/PasswordHistory')

const createError = require('http-errors');
const { addHourDbDateNow, getDbDateNow, addMinutesDbDate, getJSDateFromDb } = require('../helpers/utility')
const {authSchema, passUpdate, emailSchema, passReset, contactSchema, groupSchema} = require('../helpers/auth_validation_schema')
const  hash = require('../helpers/hash_data')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');
//const client = require('../helpers/init_redis');

const {getRandomString, getRandomNumber} = require('../helpers/code_generator')
const {ActivationCode: ActivationCodes} = require('../models/Auth/ActivationCode')
const {encryptSymmetric: encryp, decryptSymmetric: decrypt} = require('./helpers/cryptography')
const {sendMail} = require('../helpers/mailing');
const { sequelize } = require('../helpers/sequelize_init');
const { UserStatusHistory } = require('../models/Auth/UserStatusHistory');


const register = async (req, res, next) => {

    const transaction = await sequelize.transaction();
    try {
     
        // Validate request data
        const user = await userSchema.validateAsync(req.body);   //This will throw error which will be catched in catch block
        const contact = await contactSchema.validateAsync(req.body)

        const Contact = await Contacts.findOne({
            where: {email: contact.email}
        })

        if (Contact) throw createError.Conflict(`${user.email} is already been registered`)
        
        Contact = await Contacts.create(contact, {transaction})
        // Check user if exists
        let User = await Users.findOne({
            where: { user_name: user.user_name }
        }
        );

        if (User) throw createError.Conflict(`${user.email} is already been registered`)

        const userPassword =  await hash.hashPassword(user.password)
        user.password = userPassword
        user.contact_id = contact.id
        const result= await Users.create(user, {transaction})
        
            const accessToken = await signAccessToken(result.id)
            const refreshToken = await signRefreshToken(result.id)

            //Log first password usage
            const passUsage = {
                user_id: result.id,
                password: userPassword,
                start_date: getDbDateNow() ,
                is_active: true
            
            }

            await PasswordHistory.create(passUsage, {transaction})

            const userStatHistory = {
                user_id: result.id,
                status_id: 5,
                description: 'First time user created without verification',
                event_date: getDbDateNow()
            }

            UserStatusHistory.create(userStatHistory, {transaction})

            //Create email verification link
            generateVerificationEmail(result.id, user.email, user.email)

            transaction.commit()

            res.status(201).json({
                message: "User created successfully",
                accessToken,
                refreshToken,
                data:result
            })

    } catch (error) {
        transaction.rollback()
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
            user_token: token,
            expire_at: addHourDbDateNow(72)
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

    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>Thanks  your for creating acount with us, please click the link bellow to activate your account </p>'
          textBody += `<p><a href="${activationLink}">Activate My Account</a></p>`

    sendMail(email, textBody)
    
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

        const ActCode = await ActivationCodes.findOne({
            where: {[Op.and]: {user_id: tokenObj.user_id, user_token: tokenObj.user_token}}
        })

        if(!ActCode || ActCode.activation_type !=1){
            throw createError.NotFound("Activation link is not valid")
        }

        const User = await Users.findOne({
            where: {id: tokenObj.user_id}
        })

        if (!User){
            throw createError.NotFound("Activation link is not valid") 
        }

        let eventTime = getDbDateNow()

        User.email_verified = true
        User.is_active = true
        User.activated_date=eventTime

        Users.update(User, {
            where: {id:tokenObj.user_id}, fields: ['email_verified', 'is_active', 'activated_date']
        })

        const userStatHistory = {
            user_id: tokenObj.user_id,
            status_id: 1,
            description: 'User activated after email verification',
            event_date: getDbDateNow()
        }

        UserStatusHistory.create(userStatHistory, {transaction})

        res.status(200).json({
            message: "Email verified successfully",
        })
    }catch(err){
        logData('verifyEmail: ' + err)
        next(err)
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

const changePassword = async (req, res, next) => {
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

        const newPassword = await hash.hashPassword(user.password)
        User.password = newPassword
        User.retry_count = 0
        User.must_change_password = false

        Users.update(User, {where :{id: User.id}, fields: ['password', 'retry_count', 'must_change_password']})

          //Log first password usage
          const passUsage = {
            user_id: User.id,
            end_date: getDbDateNow(),
            is_active: false
        
        }

        await PasswordHistory.update(
            passUsage, {where:{[Op.and]: {user_id: User.id, is_active: true}}, fields: ['user_id', 'end_date', 'is_active']}
        )

          //Log first password usage
          const newPassUsage = {
            user_id: User.id,
            password: newPassword,
            start_date: getDbDateNow() ,
            is_active: true
        
        }

        await PasswordHistory.create(newPassUsage)

        res.status(200).json({
            message: "Password updated successfuly!",
        })


    }catch(error){
        logData('changePassword: ' + error)
        next(error)
    }
}

const requestForgotPasswordWeb = async( req, res, next) => {
    try{
        const request = await emailSchema.validateAsync(req.body); 

        const Contact = await Contacts.findOne({
            where: {email: request.email}
            , include: [Users]
        })
        if(!Contact)
            throw createError.NotFound('The Email specified could not found')
        else if (Contact?.User?.email_verified != true)
            throw createError.Forbidden('The Specified email has not bee verified')

        const token = getRandomString(64)
        const activationCode = {
            user_id: Contact.User.id,
            activation_type: 4,
            user_token: token,
            expire_at: addHourDbDateNow(24)

    }

        await ActivationCodes.create(activationCode)

        
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
        
    
    const tokenToBase64 = Buffer.from(tokenString).toString('base64')

    const activationLink = `${serviceUrl}?lnk=${tokenToBase64}`

    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>You have sent a request to reset your password, please find below link to reset your password</p>'
          textBody += `<p><a href="${activationLink}">Reset my password</a></p>`

    sendMail(email, textBody)

        res.status(200).json({
            message: "Email for password reset send successful",
        })
    }catch(err){
        logData('forgotPasssowrd: ' + err)
        next(error)
    }
}

const requestForgotPasswordApp = async( req, res, next) => {
    try{
        const request = await emailSchema.validateAsync(req.body); 

        const Contact = await Contacts.findOne({
            where: {email: request.email}
            , include: [Users]
        })
        if(!Contact)
            throw createError.NotFound('The Email specified could not found')
        else if (Contact?.User?.email_verified != true)
            throw createError.Forbidden('The Specified email has not bee verified')

        const token = getRandomNumber(8)

        const activationCode = {
            user_id: Contact.User.id,
            activation_type: 4,
            user_code: token,
            expire_at: addMinutesDbDate(10)

        }

        await ActivationCodes.create(activationCode)

        const name = `${Contact.first_name}`

    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>You have sent a request to reset your password, bellow is your reset code; valid within 10 minutes</p>'
          textBody += `<p><b>${token}</b></p>`

    sendMail(email, textBody)

        res.status(200).json({
            message: "Email for password reset send successful",
        })
    }catch(err){
        logData('forgotPasssowrd: ' + err)
        next(error)
    }
}

const resetPassword = async(req, res, next) => {
    try{
        const user = await passReset.validateAsync(req.body);

        const activationCode = await ActivationCodes.findOne({
            where: {user_code: user.reset_code}
        })

        if (!activationCode || activationCode.activation_type != 4){
            createError.NotFound('The reset code entered is not valid')
        }

        // check if reset code date is expired
        const requestTime = new Date()
        const codeCreatedAt = getJSDateFromDb( activationCode.expire_at)

        if (requestTime > codeCreatedAt){
            createError.Forbidden('The reset code entered already expired!')
        }

        const User = await Users.findOne({
            where: {id: activationCode.user_id}
        })

        if(!User){
            createError.NotFound('No user found with specified code')
        }

        const newPassword = await hash.hashPassword(user.password)
        User.password = newPassword
        Users.update(
            User, {where:{id:User.id}, fields:['password']}
        )

          //Log first password usage
          const passUsage = {
            user_id: User.id,
            end_date: getDbDateNow(),
            is_active: false
        
        }

        await PasswordHistory.update(
            passUsage, {where:{[Op.and]: {user_id: User.id, is_active: true}}, fields: ['user_id', 'end_date', 'is_active']}
        )

          //Log first password usage
          const newPassUsage = {
            user_id: User.id,
            password: newPassword,
            start_date: getDbDateNow() ,
            is_active: true
        
        }

        await PasswordHistory.create(newPassUsage)

        res.status(200).json({
            message: "Password updated successfuly!",
        })

    }catch(err){
        logData('passwordReset: ' + err)
        next(error)
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

        let session = await ActiveSession.findOne({
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
        logData('logout: ' + error)
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
    let eventTime = getDbDateNow()

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
        let activeSession = await ActiveSession.findOne({
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

        SessionHistory.create(SessionData, {transaction}),

        ActiveSession.destroy({where: {user_id: SessionData.user_id}}, {transaction})


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
    logout,
    verifyEmail,
    requestForgotPasswordWeb,
    requestForgotPasswordApp,
    resetPassword
}