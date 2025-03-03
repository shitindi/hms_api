const express = require('express')
const adminController = require('../controllers/admin.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router()

router.get("/groups", verifyAccessToken, adminController.groupDetails)
router.post("/group-edit", verifyAccessToken, adminController.editGroup)
router.get("/users", verifyAccessToken, adminController.userDetails)
router.post("/user-edit", verifyAccessToken, adminController.editUser)
router.get('/user-groups', verifyAccessToken, adminController.userGroupDetails)
router .post('/user-group-edit', verifyAccessToken, adminController.editUserGroup)
router.get("/group-permissions", verifyAccessToken,adminController.groupPermissionDetails)
router.post("group-permission-edit", verifyAccessToken, adminController.editGroupPermission)
module.exports = router