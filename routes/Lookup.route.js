const express = require('express')
const lookupController = require('../controllers/lookup.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router()

/**
 * @openapi
 * '/lookup/activation-types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get types of account activations
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/activation-types", verifyAccessToken, lookupController.activationType)


/**
 * @openapi
 * '/lookup/tenant-statuses':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get types of tenants status
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/tenant-statuses", verifyAccessToken, lookupController.tenantStatuses)

/**
 * @openapi
 * '/lookup/user-statuses':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get types of Users status
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/user-statuses", verifyAccessToken, lookupController.userStatuses)

/**
 * @openapi
 * '/lookup/permission-types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get types of permissions
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/permission-types", verifyAccessToken, lookupController.permissionTypes)

/**
 * @openapi
 * '/lookup/modules':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get aplication modules list
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/modules", verifyAccessToken, lookupController.appModules)

module.exports = router