const createError = require('http-errors');
const JWT = require('jsonwebtoken')
const {ActiveSession} = require('../models/Auth/ActiveSession');
const { User } = require('../models/Auth/User');
const { TenantLicense } = require('../models/Client/TenantLicense');



const verifyAccessToken = async (req, res, next) => {

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

            if (err.name === 'JsonWebTokenError') {
               return  next(createError.Unauthorized())
            }else {
               return  next(createError.Unauthorized(err.message))
            }
        }
          // Check if user is active
          const userId = payload.userId;
          const tenantId = payload.tenantId;

          const user =  User.findOne({
            where:  { id:userId}
          }
        )
          
          if (!user)
            return  next(createError.Unauthorized())
        
          if (user.email_verified==0 && user.sms_verified==0){
                createError.Forbidden("Your account is not activated, please activate your account to proceed")
          }

          //Check licensing details
          const License = TenantLicense.findOne({
            where: {tenant_id: tenantId}
          })

          if (!License){
            createError.Forbidden("Unable to verify your licensing details")
          }

          if(License.is_active=false){
            createError.Forbidden("Your license i")
          }else if ( new Date( License.end_date) < new Date()){
            createError.PaymentRequired("Your license is expired, please update your license!")
          }
           // req.payload = payload
            req.jwtPayload = payload
    
            next()
        
    }
    )

    
}

module.exports = {
    verifyAccessToken
}