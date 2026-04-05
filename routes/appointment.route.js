const appointmentController = require('../controllers/apointment.controller')


/**
 * @openapi
 * '/health/appointments/{id}':
 *  get:
 *    tags:
 *    - Health Management
 *    summary: Get User list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric user id, omit for all
 *    responses:
 *      200:
 *        description: Ok, List of User(s)
 */

router.get("/appointments/:id?", verifyAccessToken, appointmentController.appointmentDetails)


/**
 * @openapi
 * '/health/appointment':
 *  post:
 *     tags:
 *     - Health Management
 *     summary: Edit or Add user details
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
