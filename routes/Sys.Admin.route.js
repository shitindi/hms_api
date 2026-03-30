const express = require('express')
const adminController = require('../controllers/sys.admin.controller')
const {verifyAccessTokenAdmin} = require('../middlewares/check_auth_sys')

const router = express.Router()


/**
 * @openapi
 * '/sys_admin/groups/{id}':
 *  get:
 *    tags:
 *    - System Administration
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

router.get("/groups/:id?", verifyAccessTokenAdmin, adminController.groupDetails)

/**
 * @openapi
 * '/sys_admin/group-edit':
 *  post:
 *     tags:
 *     - System Administration
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
router.post("/group-edit", verifyAccessTokenAdmin, adminController.editGroup)

/**
 * @openapi
 * '/sys_admin/users/{id}':
 *  get:
 *    tags:
 *    - System Administration
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

router.get("/users/:id?", verifyAccessTokenAdmin, adminController.userDetails)


/**
 * @openapi
 * '/sys_admin/user-edit':
 *  post:
 *     tags:
 *     - System Administration
 *     summary: Edit or Add group details
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
router.post("/user-edit", verifyAccessTokenAdmin, adminController.editUser)

/**
 * @openapi
 * '/sys_admin/user-groups/{id}':
 *  get:
 *    tags:
 *    - System Administration
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
router.get('/user-groups/:id?', verifyAccessTokenAdmin, adminController.userGroupDetails)

/**
 * @openapi
 * '/sys_admin/user-group-edit':
 *  post:
 *     tags:
 *     - System Administration
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
router .post('/user-group-edit', verifyAccessTokenAdmin, adminController.editUserGroup)

/**
 * @openapi
 * '/sys_admin/group-permissions/{id}':
 *  get:
 *    tags:
 *    - System Administration
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
router.get("/group-permissions/:id?", verifyAccessTokenAdmin,adminController.groupPermissionDetails)

/**
 * @openapi
 * '/sys_admin/group-permission-edit':
 *  post:
 *     tags:
 *     - System Administration
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
router.post("/group-permission-edit", verifyAccessTokenAdmin, adminController.editGroupPermission)

/**
 * @openapi
 * '/sys_admin/user-permissions/{id}':
 *  get:
 *    tags:
 *    - System Administration
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
router.get("/user-permissions/:id?", verifyAccessTokenAdmin, adminController.userPermissionDetails)

/**
 * @openapi
 * '/sys_admin/user-permission-edit':
 *  post:
 *     tags:
 *     - System Administration
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
router.post("/user-permission-edit", verifyAccessTokenAdmin, adminController.editUserPermission)

module.exports = router