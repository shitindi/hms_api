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
 * '/lookups/appointment-statuses':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of appointment statuses
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/appointment-statuses", lookupController.AppointmentStatuses)

/**
 * @openapi
 * '/lookups/appointment-types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of appointment Types
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/appointment-types", lookupController.AppointmentTypes)

/**
 * @openapi
 * '/lookups/blood-groups':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Blood groups
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/blood-groups", lookupController.BloodGroups)

/**
 * @openapi
 * '/lookups/currencies':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Currencies
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/currencies", lookupController.Currencies)

/**
 * @openapi
 * '/lookups/departments':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Departments
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/departments", lookupController.Departments)

/**
 * @openapi
 * '/lookups/employment_types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of employment types
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/employment_types", lookupController.EmploymentTypes)

/**
 * @openapi
 * '/lookups/genders':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Genders
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/genders", lookupController.Genders)

/**
 * @openapi
 * '/lookups/id-types':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of ID Types
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/id-types", lookupController.IdTypes)

/**
 * @openapi
 * '/lookups/marital_statuses':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Marital statuses
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/marital-statuses", lookupController.MaritalStatuses)

/**
 * @openapi
 * '/lookups/priorities':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of activities Priorities
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/priorities", lookupController.Priorities)

/**
 * @openapi
 * '/lookups/specializations':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Specializations
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/specializations", lookupController.Specializations)

/**
 * @openapi
 * '/lookups/order-statuses':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Order statuses
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/order-statuses", lookupController.OrderStatuses)

/**
 * @openapi
 * '/lookups/billing-options':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of available billing options
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/billing-options", lookupController.BillingOptions)

/**
 * @openapi
 * '/lookups/activities':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Hospital patient activities
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/activities", lookupController.PatientActivities)

/**
 * @openapi
 * '/lookups/lab-test-categories':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Hospital Lab test categories
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/lab-test-categories", lookupController.LabTestCategories)

/**
 * @openapi
 * '/lookups/lab-test-catalogs':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Hospital Lab test categories
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/lab-test-catalogs", verifyAccessToken, lookupController.LabTestCatalogs)

/**
 * @openapi
 * '/lookups/lab-test-catalogs':
 *  get:
 *    tags:
 *    - Lookups
 *    summary: Get get list of Hospital Lab test result statuses
 *    responses:
 *      200:
 *        description: Ok
 */
router.get("/lab-test-statuses", lookupController.LabResultStatuses)


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