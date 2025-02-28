const {User: Users} = require('../models/User');
const {logData} = require('../helpers/logger')
const { LoginAttempt } = require('../models/LoginAttempt')
const { ActiveSession } = require('../models/ActiveSession')
const { SessionHistory} = require('../models/SessionHistory')

const createError = require('http-errors');
const {authSchema} = require('../helpers/validation_schema')
const  hash = require('../helpers/hash_data')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');
const client = require('../helpers/init_redis');

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
            throw createError.NotFound("User not registered")
        }

        const isMatch = await hash.isPasswordmatch(login.password, User.password)

        await logLoginAttempt(User.id, login.email, req.ip , isMatch)

        if (!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(User.id)
        const refreshToken = await signRefreshToken(User.id)

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

const refresh = async (req, res, next) => {
    try{
        const { refreshToken } = req.body
        if( !refreshToken) throw createError.BadRequest()
        const userId = await verifyRefreshToken(refreshToken)
        
        //Generate a pair of refresh and access tokens
        const accessToken = await signAccessToken(userId)
        const newRefreshToken = await signRefreshToken(userId)
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
    refresh,
    logout
}