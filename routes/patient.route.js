const patientController = require('../controllers/patient.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')
const express = require('express')
const router = express.Router();

/**
 * @openapi
 * '/patients/patients/{id}':
 *  get:
 *    tags:
 *    - Health Management
 *    summary: Get Patient list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric Patient id, omit for all
 *    responses:
 *      200:
 *        description: Ok, List of Patients(s)
 */

router.get("/patients/:id?", verifyAccessToken, patientController.patientDetails)


/**
 * @openapi
 * '/patients/patient':
 *  post:
 *     tags:
 *     - Health Management
 *     summary: Edit or Add Patient details
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
 *              - birth_date
 *              - next_kin_name
 *              - next_kin_phone
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
 *              contact_id:
 *                type: integer
 *              contact_type:
 *                type: integer
 *                default: 1
 *              tenant_id:
 *                type: integer   
 *              gender_id:
 *                type: integer
 *              registration_no:
 *                type: string
 *              id_type:
 *                type: integer
 *              id_number:
 *                type: integer
 *              marital_status:
 *                type: integer
 *              birth_date:
 *                type: string
 *              blood_group:
 *                type: integer
 *              next_kin_name:
 *                type: string
 *              next_kin_type:
 *                type: string
 *              next_kin_phone:
 *                type: string
 *              joining_date:
 *                type: string
 *              current_activity:
 *                type: integer
 *              is_active:
 *                type: boolean     
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/patient", verifyAccessToken, patientController.editPatient)

module.exports = router;