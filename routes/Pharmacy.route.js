const medicineController = require('../controllers/pharmacy.controller')

const {verifyAccessToken} = require('../middlewares/check_auth')

const express = require('express')
const router = express.Router();

router.get("/today-requests/:id?", verifyAccessToken, medicineController.todayPrescriptionRequests)

router.post("/dispence-medicine", verifyAccessToken, medicineController.editPrescriptionDispense)

router.get("/medicines/:id?", verifyAccessToken, medicineController.medicineDetails)

router.post("/medicine", verifyAccessToken, medicineController.editMedicine)

router.get("/prescriptions/:id?", verifyAccessToken, medicineController.appointmentPrescription)

router.post("/prescription", verifyAccessToken, medicineController.editPrescription)
module.exports = router
