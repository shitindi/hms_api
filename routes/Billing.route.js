const {verifyAccessToken} = require('../middlewares/check_auth')
const billingController = require('../controllers/billing.controller')
const express = require('express')
const router = express.Router();

router.get("/waiting-payments", verifyAccessToken, billingController.todayAppointmentsBilling)

router.post("/pay-service",verifyAccessToken, billingController.makeServicePayment)

module.exports = router