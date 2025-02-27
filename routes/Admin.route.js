const express = require('express')
const adminController = require('../controllers/admin.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router()

router.get("/", verifyAccessToken, adminController.index)

module.exports = router