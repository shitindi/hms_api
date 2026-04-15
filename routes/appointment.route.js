const appointmentController = require('../controllers/apointment.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')
const express = require('express')
const router = express.Router();

/**
 * @openapi
 * '/appointments/appointments/{id}':
 *  get:
 *    tags:
 *    - Health Management
 *    summary: Get appointment list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric Appointment id, omit for all
 *    responses:
 *      200:
 *        description: Ok, List of Appointment(s)
 */

router.get("/appointments/:id?", verifyAccessToken, appointmentController.appointmentDetails)

/**
 * @openapi
 * '/appointments/by-doctor':
 *  get:
 *    tags:
 *    - Health Management
 *    summary: Get Appointment list by doctor
 *    responses:
 *      200:
 *        description: Ok, get List of appointments to a specific doctor
 */

router.get("/by-doctor", verifyAccessToken, appointmentController.appointmentsViewByDoctor)

/**
 * @openapi
 * '/appointments/appointment':
 *  post:
 *     tags:
 *     - Health Management
 *     summary: Edit or Add Appointment details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - tenant_id
 *              - visit_type
 *              - doctor_id
 *              - appointment_date
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
 *                type: integer
 *              patient_id:
 *                type: integer
 *              visit_type:
 *                type: integer
 *              department_id:    
 *                type: integer
 *              doctor_id:
 *                type: integer
 *              appointment_date:
 *                type: string
 *              priority:
 *                type: integer
 *              appointment_reason:
 *                type: string
 *              appointment_status:
 *                type: integer
 *              notification_notes:
 *                type: string
 *              sms_notification:
 *                type: boolean
 *              email_notification:
 *                type: boolean
 *              appointment_no:
 *                type: string
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/appointment", verifyAccessToken, appointmentController.editAppointment)

/**
 * @openapi
 * '/appointments/check-in':
 *  post:
 *     tags:
 *     - Health Management
 *     summary: Check in patient for consultation
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - id
 *            properties:
 *              id:
 *                type: integer
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/check-in", verifyAccessToken, appointmentController.checkinAppointment)

module.exports = router;