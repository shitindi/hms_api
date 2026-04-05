const express = require('express')
const adminController = require('../controllers/admin.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')
const {verifyAccessTokenAdmin} = require('../middlewares/check_auth_sys')

const router = express.Router()


/**
 * @openapi
 * '/admin/groups/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get groups list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric group id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */

router.get("/groups/:id?", verifyAccessToken, adminController.groupDetails)

/**
 * @openapi
 * '/admin/group':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add group details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - group_name
 *              - tenant_id
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              group_name:
 *                type: string
 *              tenant_id:
 *                type: integer
 *              desription:
 *                type: string
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
router.post("/group", verifyAccessToken, adminController.editGroup)
/**
 * @openapi
 * '/admin/contacts/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get contacts list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric group id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/contacts/:id?", verifyAccessToken, adminController.contactDetails)
 /**
 * @openapi
 * '/sales/contacts':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add contact details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - first_name
 *              - last_name
 *              - mobile_no
 *              - contact_type
 *              - tenant_id
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
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
 *              contact_type:
 *                type: integer
 *              created_by:
 *                type: integer
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/contact", verifyAccessToken, adminController.editContact)

/**
 * @openapi
 * '/admin/users/{id}':
 *  get:
 *    tags:
 *    - Administration
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

router.get("/users/:id?", verifyAccessToken, adminController.userDetails)

/**
 * @openapi
 * '/admin/user':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add user details
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
 *              - gender_id
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
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/user", verifyAccessToken, adminController.editUser)

/**
 * @openapi
 * '/admin/user-groups/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get usergroups list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric usergroup id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get('/user-groups/:id?', verifyAccessToken, adminController.userGroupDetails)

/**
 * @openapi
 * '/admin/user-group':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add user in group
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - group_id
 *              - user_id
 *              - tenant_id
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
 *                type: integer
 *              user_id:
 *                type: integer
 *              group_id:
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
router .post('/user-group', verifyAccessToken, adminController.editUserGroup)

/**
 * @openapi
 * '/admin/group-permissions/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get groups Permission list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric group permission id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/group-permissions/:id?", verifyAccessToken,adminController.groupPermissionDetails)

/**
 * @openapi
 * '/admin/group-permission':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add group permission details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - module_id
 *              - group_id
 *              - tenant_id
 *              - permission_type
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
 *                 type: integer
 *              module_id:
 *                type: integer
 *              group_id:
 *                type: integer
 *              permission_type:
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
router.post("/group-permission", verifyAccessToken, adminController.editGroupPermission)

/**
 * @openapi
 * '/admin/user-permissions/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get User Permission list
 *    parameters:
 *      - in: path
 *        name: id
 *        type: integer
 *        required: false
 *        description: Numeric user permission id, omit for all
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/user-permissions/:id?", verifyAccessToken, adminController.userPermissionDetails)

/**
 * @openapi
 * '/admin/user-permission':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add group permission details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - module_id
 *              - tenant_id
 *              - user_id
 *              - permission_type
 *              - created_by
 *            properties:
 *              id:
 *                type: integer
 *              tenant_id:
 *                 type: integer
 *              module_id:
 *                type: integer
 *              user_id:
 *                type: integer
 *              permission_type:
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
router.post("/user-permission", verifyAccessToken, adminController.editUserPermission)

/**
 * @openapi
 * '/admin/tenant-details/{id}':
 *  get:
 *    tags:
 *    - Administration
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
 * '/admin/tenant-branches/{id}':
 *  get:
 *    tags:
 *    - Administration
 *    summary: Get tenants branches list
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
router.get("/tenant-branches/:id?", verifyAccessToken, adminController.tenantBranchDetails)

/**
 * @openapi
 * '/admin/tenant-branch':
 *  post:
 *     tags:
 *     - Administration
 *     summary: Edit or Add tenant branch details
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - branch_name
 *              - tenant_id
 *              - created_by
 *              - contact_person
 *            properties:
 *              id:
 *                type: integer
 *              branch_name:
 *                type: string
 *              tenant_id:
 *                type: integer
 *              desription:
 *                type: string
 *              created_by:
 *                type: integer
 *              is_active:
 *                type: boolean
 *                default: false
 *              country_id:
 *                type: integer
 *              region_id:
 *                type: integer
 *              region_name:
 *                type: string
 *              address:
 *                type: string
 *              phone:
 *                type: string
 *              contact_person:
 *                type: integer
 *
 *     responses:
 *      200:
 *        description: Ok, with created or updated object
 *      409:
 *        description: Conflict
 */
router.post("/tenant-branch", verifyAccessToken, adminController.editTenantBranch)

module.exports = router