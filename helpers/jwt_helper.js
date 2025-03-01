const client = require('./init_redis')
const {logData} = require('../helpers/logger')
const { ActiveSession: Session } = require('../models/ActiveSession')
const {Op} = require('sequelize')


const JWT = require('jsonwebtoken')
const createError = require('http-errors')

const signAccessToken =  (userId, roles = [0]) => {
    return new Promise((resolve, reject) => {
        
        const payload = {
            roles
        }
        const secret = process.env.ACCESS_TOKEN_SECRET 
        const options = {
            expiresIn:  process.env.ACCESS_TOKEN_EXPIRE_IN,
            issuer: "byteware.co.tz",
            audience: userId.toString(),
            
        }
        JWT.sign(payload, secret, options, (err, token) => {
            if (err){
                logData('signAccessToken'+ err)
                reject(createError.InternalServerError())
            } 
            
            resolve(token)
        })
    })
}

const signRefreshToken = (userId, roles = [0]) => {

    return new Promise( (resolve, reject) => {
        
        const payload = {
            roles
        }
        
        const secret = process.env.REFRESH_TOKEN_SECRET
        const refExpTime = process.env.REFRESH_TOKEN_EXPIRE_IN 


        const options = {
            expiresIn: refExpTime + 'd',
            issuer: "byteware.co.tz",
            audience: userId.toString(),
            
        }
        JWT.sign(payload, secret, options,  (err, token) => {
            if (err){
                logData('signAccessToken'+ err)
                reject(createError.InternalServerError())
            } 
           
           // await client.connect()
         
           resolve(token) 

           /*
           client.SET(userId.toString(), token, {EX: refExpTime * 60 * 60 * 24})
           .then( reply => {
            resolve(token) 
           })
           .catch( err => {
            logData("signAccessToken: "+err)
            reject(createError.InternalServerError())
            return
           })  
            */         
        })
    })
}


const verifyRefreshToken = refreshToken => {
    const secret =  process.env.REFRESH_TOKEN_SECRET
   return new Promise( (resolve, reject) => {
    JWT.verify(refreshToken, secret, (err, payload) => {
        if (err) return reject(createError.Unauthorized())
        
        // extract userid from redis
        const userId = payload.aud

        let User = Session.findOne({
            where: {[Op.and] : {user_id: userId, refresh_token: refreshToken}}
        })
        
        if (!User){
            return reject(createError.Unauthorized()) 
        }
        /*
        client.GET(userId.toString())
        .then( result => {
            if (refreshToken ===result) return resolve(userId)

            reject(createError.Unauthorized())
        })
        .catch( err =>{
            logData('verifyRefreshToken: ' + err)
            reject(createError.InternalServerError())
            return
        })
        */

        resolve(userId)
    })
   })  
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
}