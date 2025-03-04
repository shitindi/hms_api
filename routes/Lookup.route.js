const express = require('express')
const lookupController = require('../controllers/lookup.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router()

router.get("/activation-types", verifyAccessToken, lookupController.activationType)
router.get("/tenant-statuses", verifyAccessToken, lookupController.tenantStatuses)
router.get("/user-statuses", verifyAccessToken, lookupController.userStatuses)
router.get("/permission-types", verifyAccessToken, lookupController.permissionTypes)

module.exports = router