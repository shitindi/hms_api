const adminController = require('../controllers/admin.controller')
const doctorController = require('../controllers/doctor.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const express = require('express')
const router = express.Router();
/**
 * @openapi
 * '/doctors/doctors/{id}':
 *  get:
 *    tags:
 *    - Health Management
 *    summary: Get Doctors list
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

router.get("/doctor/:id?", verifyAccessToken, doctorController.doctorDetails)


/**
 * @openapi
 * '/doctors/doctor':
 *  post:
 *     tags:
 *     - Health Management
 *     summary: Edit or Add Doctor details
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
 *              - id_type
 *              - id_number
 *              - employment_type
 *            properties:
 *              id:
 *                type: integer
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
 *              gender_id:
 *                type: integer
 * 
 *              doctor_id:
 *                type: integer
 *              id_type:
 *                type: integer
 *              id_number:
 *                type: integer
 *              doctor_id_no:
 *                type: string
 *              license_number:
 *                type: string
 *              specialization:
 *                type: integer
 *              highest_qualification:
 *                type: string
 *              year_of_experience:
 *                type: integer
 *              employment_type:
 *                type: integer
 *              joining_date:
 *                type: string
 *              is_active:
 *                type: boolean     
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/doctor", verifyAccessToken, adminController.editUser)

module.exports = router;