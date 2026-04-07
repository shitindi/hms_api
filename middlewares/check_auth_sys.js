const createError = require('http-errors');
const JWT = require('jsonwebtoken')
const {ActiveSession} = require('../models/Auth/ActiveSession');
const { Tenant } = require('../models/Auth/Tenant');



const verifyAccessTokenAdmin = async (req, res, next) => {

    if (!req.headers['authorization']) return next(createError.Unauthorized())

    const token = req.headers['authorization'].split(' ')[1]
    const secret = process.env.ACCESS_TOKEN_SECRET;

    let  SessionData = await ActiveSession.findOne(
        {user_token: token}
    );


    if (!SessionData){
        return  next(createError.Unauthorized())
    }

    JWT.verify(token, secret, (err, payload) => {

        if (err) {
            console.error("Error: ", err)

            if (err.name === 'JsonWebTokenError') {
               return  next(createError.Unauthorized())
            }else {
               return  next(createError.Unauthorized(err.message))
            }
        }
        //Verify if tenant has proper role
         const tenant = Tenant.findOne({
            where : {id:payload.tenantId}
         })
         if (!tenant || tenant.tenant_type !=1)
            return next(createError.Unauthorized())
           // req.payload = payload
            req.jwtPayload = payload
    
            next()
        
    }
    )

    
}

module.exports = {
    verifyAccessTokenAdmin
}