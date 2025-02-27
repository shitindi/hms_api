const {User: Users} = require('../models/User');
const {logData} = require('../helpers/logger')

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

        if( !User) throw createError.NotFound("User not registered")

        const isMatch = await hash.isPasswordmatch(login.password, User.password)
        if (!isMatch) throw createError.Unauthorized('Username/password not valid')

        const accessToken = await signAccessToken(User.id)
        const refreshToken = await signRefreshToken(User.id)
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
        client.DEL(userId.toString())
        .then(val => {
            res.sendStatus(204)
        })
        .catch( err => {
            logData('logout: ' + err)
            throw createError.InternalServerError()
        })
    }catch(error){
        next(error)
    }
}



module.exports = {
    register,
    login,
    refresh,
    logout
}