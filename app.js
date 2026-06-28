const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')

const swaggerDocs = require('./swagger.js')


// routes
const authRoute = require('./routes/Auth.route')
const adminRoute = require('./routes/Admin.route')
const lookupRoute = require('./routes/Lookup.route')
const sysAdminRoute = require('./routes/Sys.Admin.route.js')
const appointmentRoute = require('./routes/appointment.route.js')
const doctorroute = require('./routes/doctor.route.js')
const patientRoute = require('./routes/patient.route.js')
const medicineRoute = require('./routes/Pharmacy.route.js')
const billingRoute = require('./routes/Billing.route.js')
const labServiceRoute = require('./routes/labservice.route.js')
require('dotenv').config()
//require('./helpers/init_redis')

const app = express()
app.use(morgan('env'))
app.use(express.json())
app.set('trust proxy', true)

// configure CORS
app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
     res.header("Access-Control-Allow-Credentials", true);
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}
)
//Handle form data encoded in url
//app.unsubscribe(express.urlencoded({extended: true}))

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
   
})
swaggerDocs(app, );

app.use("/auth", authRoute)
app.use("/admin", adminRoute)
app.use("/lookups", lookupRoute)
app.use("/sys_admi", sysAdminRoute)
app.use("/appointments", appointmentRoute)
app.use("/doctors", doctorroute)
app.use("/patients", patientRoute)
app.use("/pharmacy", medicineRoute)
app.use("/billing" , billingRoute)
app.use("/labservices", labServiceRoute)

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


