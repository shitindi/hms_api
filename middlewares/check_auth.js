const createError = require('http-errors');
const JWT = require('jsonwebtoken')


const verifyAccessToken = (req, res, next) => {

    if (!req.headers['authorization']) return next(createError.Unauthorized())

    const token = req.headers['authorization'].split(' ')[1]
    const secret = process.env.ACCESS_TOKEN_SECRET;

    JWT.verify(token, secret, (err, payload) => {

        if (err) {
            console.error("Error: ", err)

            if (err.name === 'JsonWebTokenError') {
               return  next(createError.Unauthorized())
            }else {
               return  next(createError.Unauthorized(err.message))
            }
        }
            req.payload = payload
            next()
        
    }
    )

    
}

module.exports = {
    verifyAccessToken
}