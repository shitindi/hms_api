const express = require('express')
const authController = require('../controllers/auth.controller');

const router = express.Router();
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/update-pass"), authController.changePassword
router.post("/refresh-token", authController.refresh)
router.post("/logout", authController.logout)
router.post("/forgot-password", authController.requestForgotPasswordApp)
router.post("/reset-password", authController.resetPassword)
router.get("/verifyEmail", authController.verifyEmail)

module.exports = router;