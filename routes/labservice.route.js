const labController = require('../controllers/labservice.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const express = require('express')
const router = express.Router();

router.get("/today-request/:id?", verifyAccessToken, labController.todayLabRequests)


module.exports = router;