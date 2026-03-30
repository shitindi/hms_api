const createError = require('http-errors');
const { logData } = require('../helpers/logger');
const {ActivationType} = require('../models/Auth/ActivationType')
const {TenantStatus} = require('../models/Auth/TenantStatus')
const {UserStatus} = require('../models/Auth/UserStatus')
const {PersmissionType} = require('../models/Auth/PermisionType')
const {Module} = require('../models/Auth/Module');
const { LicensePaymentMethod } = require('../models/Client/LicensePaymentMethod');
const { LicensePaymentType } = require('../models/Client/LIcensePyamentType');
const { TenantRegion } = require('../models/Client/Regions');
const { TenantCountry } = require('../models/Client/Countries');
const { PaymentStatus } = require('../models/sales/PaymentStatus');
const { ContactType } = require('../models/Auth/ContactType');
const { TaxGroup } = require('../models/lookup/TaxtGroup');
const { TenantType } = require('../models/Auth/TenantType');
const { CustomerType } = require('../models/sales/CustomerType');
const { orderStatus } = require('../models/sales/OrderSTatus');


// Authentication lookup
const activationType = async (req, res, next) => {

    try{
        console.log("User ID: ", req.jwtPayload.userId, ', Tenant Id: ', req.jwtPayload.tenantId,', roles: ', req.jwtPayload.roles,
             ', Path: ', req.path)
        const activationTypes = await ActivationType.findAll()

        res.status(200).json( activationTypes)
    }catch(err){
        logData('activationType: ' + err)
        next(err)
    }
}

const tenantStatuses = async (req, res, next) => {

    try{
        const tenantStatuses = await TenantStatus.findAll()

        res.status(200).json( tenantStatuses)
    }catch(err){
        logData('tenantStatuses: ' + err)
        next(err)
    }
}

const userStatuses = async (req, res, next) => {

    try{
        const userStatuses = await UserStatus.findAll()

        res.status(200).json( userStatuses)
    }catch(err){
        logData('userStatuses: ' + err)
        next(err)
    }
}


const permissionTypes = async (req, res, next) => {

    try{
        const permissionTypes = await PersmissionType.findAll()

        res.status(200).json( permissionTypes)
    }catch(err){
        logData('permissionTypes: ' + err)
        next(err)
    }
}

const appModules = async(req, res, next) => {
    try{
        const appModules = await Module.findAll()

        res.status(200).json(appModules)
    }catch(err){
        logData('appModules: ' + err)
        next(err)
    }
}

const paymentMethod = async(req, res, next) => {
    try{
        const paymethods = await LicensePaymentMethod.findAll()

        res.status(200).json(paymethods)
    }catch(err){
        logData('paymethods: ' + err)
        next(err)
    }
}

const paymentType = async(req, res, next) => {
    try{
        const payTypes = await LicensePaymentType.findAll()

        res.status(200).json(payTypes)
    }catch(err){
        logData('payTypes: ' + err)
        next(err)
    }
}

const Regions = async(req, res, next) => {
    try{
        const regions = await TenantRegion.findAll()

        res.status(200).json(regions)
    }catch(err){
        logData('Regions: ' + err)
        next(err)
    }
}

const paymentStatus = async(req, res, next) => {
    try{
        const payStatuses = await PaymentStatus.findAll()

        res.status(200).json(payStatuses)
    }catch(err){
        logData('payStatuses: ' + err)
        next(err)
    }
}

const Countries = async(req, res, next) => {
    try{
        const countries = await TenantCountry.findAll()

        res.status(200).json(countries)
    }catch(err){
        logData('countries: ' + err)
        next(err)
    }
}


const ContactTypes = async(req, res, next) => {
    try{
        const contactTypes = await ContactType.findAll()

        res.status(200).json(contactTypes)
    }catch(err){
        logData('ContactTypes: ' + err)
        next(err)
    }
}

const TaxGroups = async(req, res, next) => {
    try{
        const taxGroups = await TaxGroup.findAll()

         res.status(200).json(taxGroups)
  
    }catch(err){
        logData('TaxGroups: ' + err)
        next(err)
    }
}

const GetLookupsAll = async(req, res, next) => {
    try{
        const activation_types = await ActivationType.findAll()
        const tenant_statuses =  await TenantType.findAll()
        const user_statuses = await UserStatus.findAll()
        const payment_method = await LicensePaymentMethod.findAll()
        const payment_types = await LicensePaymentType.findAll()
        const regions =  await TenantRegion.findAll()
        const payment_statuses = await PaymentStatus.findAll()
        const countries = await TenantCountry.findAll()
        const contact_types = await ContactType.findAll()
        const tax_groups = await TaxGroup.findAll()
        const customer_types = await CustomerType.findAll()
        const order_statuses = await orderStatus.findAll()

        console.log('CUSTOMER TYPE: ', customer_types)
        
        res.status(200).json({
            activation_types,
            tenant_statuses,
            user_statuses,
            payment_method,
            payment_types,
            regions,
            payment_statuses,
            countries,
            contact_types,
            tax_groups,
            customer_types,
            order_statuses
        })

    }catch(err){
        logData('GetLookupsAll: ' + err)
        next(err)
    }
}


module.exports = {
    activationType,
    tenantStatuses,
    userStatuses,
    permissionTypes,
    appModules,
    paymentMethod,
    paymentType,
    Regions,
    paymentStatus,
    Countries,
    ContactTypes,
    TaxGroups,
    GetLookupsAll
}