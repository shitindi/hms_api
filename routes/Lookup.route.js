const express = require('express')
const lookupController = require('../controllers/lookup.controller')
const {verifyAccessToken} = require('../middlewares/check_auth')

const router = express.Router()

/**
 * @openapi
 * '/lookups/activation-types':
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
 * '/lookups/tenant-statuses':
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
 * '/lookups/user-statuses':
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
 * '/lookups/permission-types':
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
 * '/lookups/modules':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get aplication modules list
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/modules", verifyAccessToken, lookupController.appModules)

/**
 * @openapi
 * '/lookups/regions':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get list of regions
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/regions", lookupController.Regions)

/**
 * @openapi
 * '/lookups/payment-status':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get payment statutes
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/payment-status", verifyAccessToken, lookupController.paymentStatus)

/**
 * @openapi
 * '/lookups/countries':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of countries
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/countries", lookupController.Countries)

/**
 * @openapi
 * '/lookups/contact-types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of countries
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/contact-types", lookupController.ContactTypes)

/**
 * @openapi
 * '/lookups/tax-groups':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of tax groups
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/tax-groups", lookupController.TaxGroups)

/**
 * @openapi
 * '/lookups/get-all-lookups':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of tax groups
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/get-all-lookups", lookupController.GetLookupsAll)

module.exports = router