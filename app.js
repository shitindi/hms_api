const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')

const swaggerDocs = require('./swagger.js')


// routes
const authRoute = require('./routes/Auth.route')
const adminRoute = require('./routes/Admin.route')
const lookupRoute = require('./routes/Lookup.route')
require('dotenv').config()
//require('./helpers/init_redis')

const app = express()
app.use(morgan('env'))
app.use(express.json())
app.set('trust proxy', true)

//Handle form data encoded in url
app.unsubscribe(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 7000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
   
})
swaggerDocs(app, );

app.use("/auth", authRoute)
app.use("/admin", adminRoute)
app.use("/lookup", lookupRoute)


// Catch all routes
app.use (async (req, res, next) =>{

        // the use of http-errors package
        next(createError.NotFound('This route does not exist'));
    }
)

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status:err.status || 500,
            message: err.message
        }
    })
}
)


