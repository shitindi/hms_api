const express = require('express')
const adminController = require('../controllers/sys.admin.controller')
const {verifyAccessTokenAdmin} = require('../middlewares/check_auth_sys')

const router = express.Router()
/**
 * @openapi
 * '/clients/tenant-details/{id}':
 *  get:
 *    tags:
 *    - Clients Administration
 *    summary: Get tenants list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric tenant id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/tenant-details/:id?", verifyAccessTokenAdmin, adminController.tenantDetails)

/**
 * @openapi
 * '/clients/licence-package/{id}':
 *  get:
 *    tags:
 *    - Clients Administration
 *    summary: Get Package list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric tenant id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/licence-package/:id?", adminController.licencePackageDetails)

/**
 * @openapi
 * '/clients/licence-package-edit':
 *  post:
 *     tags:
 *     - Clients Administration
 *     summary: Edit or Add License packages
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - package_name
 *              - description
 *              - price
 *              - app_id
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              package_name:
 *                 type: string
 *              description:
 *                type: string
 *              price:
 *                type: integer
 *              app_id:
 *                type: integer
 *              created_by:
 *                type: integer
 *              is_active:
 *                type: boolean
 *                default: false
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/licence-package-edit",verifyAccessTokenAdmin,adminController.editLicensePackage)

/**
 * @openapi
 * '/clients/payment-method/{id}':
 *  get:
 *    tags:
 *    - Clients Administration
 *    summary: Get Payment method list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric tenant id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/payment-method/:id", verifyAccessTokenAdmin, adminController.paymentMethodDetails)

/**
 * @openapi
 * '/clients/payment_method-edit':
 *  post:
 *     tags:
 *     - Clients Administration
 *     summary: Edit or Add Payment method
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - tenant_id
 *              - name
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
 *                 type: string
 *              name:
 *                type: string
 *              account_number:
 *                type: string
 *              created_by:
 *                type: integer
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.get("/payment_method-edit",verifyAccessTokenAdmin, adminController.editPaymentMethod)

/**
 * @openapi
 * '/clients/user-count/{id}':
 *  get:
 *    tags:
 *    - Clients Administration
 *    summary: Get license User count list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric tenant id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/user-count/:id",verifyAccessTokenAdmin,adminController.userCountDetails)

/**
 * @openapi
 * '/clients/user-count-edit':
 *  post:
 *     tags:
 *     - Clients Administration
 *     summary: Edit or Add User count license
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - description
 *              - price
 *              - user_count
 *              - is_active
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              description:
 *                 type: string
 *              user_count:
 *                 type: integer
 *              price:
 *                type: integer
 *              created_by:
 *                type: integer
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.get("/user-count-edit", verifyAccessTokenAdmin, adminController.editUserCount)

/**
 * @openapi
 * '/clients/branch-countt/{id}':
 *  get:
 *    tags:
 *    - Clients Administration
 *    summary: Get license Branch count list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric tenant id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/branch-count/:id",verifyAccessTokenAdmin,adminController.branchCountDetails)

/**
 * @openapi
 * '/clients/branch-count-edit':
 *  post:
 *     tags:
 *     - Clients Administration
 *     summary: Edit or Add Branch count license
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - description
 *              - price
 *              - branch_count
 *              - is_active
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              description:
 *                 type: string
 *              branch_count:
 *                 type: string
 *              price:
 *                type: integer
 *              created_by:
 *                type: integer
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.get("/branch-count-edit", verifyAccessTokenAdmin, adminController.editBranchCount)

module.exports = router;