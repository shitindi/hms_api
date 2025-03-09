const express = require('express')
const authController = require('../controllers/auth.controller');
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router();


/**
 * @openapi
 * '/aut/register':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Register new user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - first_name
 *              - last_name
 *              - email
 *              - mobile_no
 *              - tenant_id
 *              - created_by
 *              - contact_type
 *            properties:
 *              first_name:
 *                type: string
 *              middle_name:
 *                type: string
 *              last_name:
 *                type: string
 *              email:
 *                type: string
 *              mobile_no:
 *                type: string
 *              phone:
 *                type: string
 *              position:
 *                type: string
 *              address:
 *                type: string
 *              created_by:
 *                type: integer
 *              user_id:
 *                type: integer
 *              user_name:
 *                type: string
 *              password:
 *                type: string
 *              confirm_password:
 *                type: string
 *              must_change_password:
 *                type: boolean
 *                default: true
 *              contact_id:
 *                type: integer
 *              contact_type:
 *                type: integer
 *                default: 1
 *              tenant_id:
 *                type: integer
 *              user_status:
 *                type: integer
 *                default: 5         
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/register", authController.register)

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Login
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      200:
 *        description: Login succeeded
 *      404:
 *        description: Credential not matched any user
 */
router.post("/login", authController.login)


/**
 * @openapi
 * '/auth/update-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Change user password
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *              - newPassword
 *              - confirmPassword       
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              newPassword:
 *                type: string
 *              confirmPassword:
 *                 type: string
 *     responses:
 *      200:
 *        description: Password updated succesffuly
 *      404:
 *        description: Original password did not match
 */
router.post("/update-password", verifyAccessToken, authController.changePassword)

/**
 * @openapi
 * '/auth/refresh-token':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Request new authorization token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - refreshToken
 *            properties:
 *              refreshToken:
 *     responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized
 */
router.post("/refresh-token", authController.refresh)

/**
 * @openapi
 * '/auth/logout':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Logout
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *              - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *     responses:
 *      204:
 *        description: logout succeeded no content returned
 */
router.post("/logout",verifyAccessToken, authController.logout)

/**
 * @openapi
 * '/auth/forgot-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Generate forgot password link or OTP
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *     responses:
 *      200:
 *        description: Success
 *      404:
 *        description: Email not found
 *      403:
 *        description: email not verified
 */
router.post("/forgot-password", authController.requestForgotPasswordApp)


/**
 * @openapi
 * '/auth/reset-password':
 *  post:
 *     tags:
 *     - Authentication
 *     summary: Reset user password with OTP Code
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - reset_code
 *              - newPassword
 *              - confirmPassword
 *            properties:
 *              reset_code:
 *                type: number
 *              newPassword:
 *                type: string
 *              confirmPassword:
 *                 type: string
 *     responses:
 *      200:
 *        description: Password updated succesffuly
 *      404:
 *        description: Invalid code intered
 *      403:
 *         description: Code expired
 */
router.post("/reset-password", authController.resetPassword)

router.get("/verifyEmail", authController.verifyEmail)

module.exports = router;