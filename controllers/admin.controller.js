const createError = require('http-errors');


const index = (req, res, next) =>{
    try{
     res.send(req.payload)
    } catch(error){
       console.log('admin.index: ', error)
         next(createError.InternalServerError())
        }
}

module.exports = {
    index
}