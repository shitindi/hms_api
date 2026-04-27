const medicineController = require('../controllers/pharmacy.controller')

const {verifyAccessToken} = require('../middlewares/check_auth')

const express = require('express')
const router = express.Router();

router.get("/medicines/:id?", verifyAccessToken, medicineController.medicineDetails)

router.post("/medicine", verifyAccessToken, medicineController.editMedicine)

module.exports = router
