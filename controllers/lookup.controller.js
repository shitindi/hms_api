const createError = require('http-errors');
const { logData } = require('../helpers/logger');
const {ActivationType} = require('../models/Auth/ActivationType')
const {TenantStatus} = require('../models/Auth/TenantStatus')
const {UserStatus} = require('../models/Auth/UserStatus')
const {PersmissionType} = require('../models/Auth/PermisionType')
const {Module} = require('../models/Auth/Module');
const { LicensePaymentMethod } = require('../models/Client/LicensePaymentMethod');
const { LicensePaymentType } = require('../models/Client/LIcensePyamentType');
const { TenantCountry } = require('../models/Client/Countries');
const { ContactType } = require('../models/Auth/ContactType');
const { TenantType } = require('../models/Auth/TenantType');


const { TenantRegion } = require('../models/Lookup/Regions');
const { PaymentStatus } = require('../models/Main/PaymentStatus');
const { OrderStatus } = require('../models/Lookup/OrderStatus');
const {AppointmentStatus} = require('../models/Lookup/AppointmentStatus')
const {AppointmentType} = require('../models/Lookup/AppointmentType')
const {BloodGroup} = require('../models/Lookup/BloodGroup')
const {Currrency} = require('../models/Lookup/Currency')
const {Department} = require('../models/Lookup/Department')
const {EmploymentType} = require('../models/Lookup/EmploymentType')
const {Gender} = require('../models/Lookup/Gender')
const {IDType} = require('../models/Lookup/IDType')
const {MaritalStatus} = require('../models/Lookup/MaritalStatus')
const {Specialization} = require('../models/Lookup/Specialization')
const {Priority} = require('../models/Lookup/Priority');
const { BillingOption } = require('../models/Lookup/BillingtOption');
const { PatientActivity } = require('../models/Lookup/PatientActivity');
const { Insurer } = require('../models/Main/Insurer');


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

const OrderStatuses = async(req, res, next) => {
    try{
        const orderStatus = await OrderStatus.findAll()

        res.status(200).json(orderStatus)
    }catch(err){
        logData('OrderStatus: ' + err)
        next(err)
    }
}

const AppointmentStatuses = async(req, res, next) => {
    try{
        const appointmentStatuses = await AppointmentStatus.findAll()

        res.status(200).json(appointmentStatuses)
    }catch(err){
        logData('AppointmentStatuses: ' + err)
        next(err)
    }
}

const AppointmentTypes = async(req, res, next) => {
    try{
        const appointmentStatuses = await AppointmentType.findAll()

        res.status(200).json(appointmentStatuses)
    }catch(err){
        logData('AppointmentTypes: ' + err)
        next(err)
    }
}

const BloodGroups = async(req, res, next) => {
    try{
        const bloodGroups = await BloodGroup.findAll()

        res.status(200).json(bloodGroups)
    }catch(err){
        logData('BloodGroups: ' + err)
        next(err)
    }
}

const Currencies = async(req, res, next) => {
    try{
        const currencies = await Currrency.findAll()

        res.status(200).json(currencies)
    }catch(err){
        logData('Currencies: ' + err)
        next(err)
    }
}

const Departments = async(req, res, next) => {
    try{
        const departments = await Department.findAll()

        res.status(200).json(departments)
    }catch(err){
        logData('Departments: ' + err)
        next(err)
    }
}

const EmploymentTypes = async(req, res, next) => {
    try{
        const employmentTypes = await EmploymentType.findAll()

        res.status(200).json(employmentTypes)
    }catch(err){
        logData('EmploymentTypes: ' + err)
        next(err)
    }
}

const Genders = async(req, res, next) => {
    try{
        const genders = await Gender.findAll()

        res.status(200).json(genders)
    }catch(err){
        logData('Genders: ' + err)
        next(err)
    }
}

const IdTypes = async(req, res, next) => {
    try{
        const idTypes = await IDType.findAll()

        res.status(200).json(idTypes)
    }catch(err){
        logData('IdTypes: ' + err)
        next(err)
    }
}

const MaritalStatuses = async(req, res, next) => {
    try{
        const maritalStatutes = await MaritalStatus.findAll()

        res.status(200).json(maritalStatutes)
    }catch(err){
        logData('MaritalStatuses: ' + err)
        next(err)
    }
}

const Specializations = async(req, res, next) => {
    try{
        const specializations = await Specialization.findAll()

        res.status(200).json(specializations)
    }catch(err){
        logData('Specializations: ' + err)
        next(err)
    }
}

const Priorities = async(req, res, next) => {
    try{
        const priorities = await Priority.findAll()

        res.status(200).json(priorities)
    }catch(err){
        logData('Priorities: ' + err)
        next(err)
    }
}

const BillingOptions = async(req, res, next) => {
    try{
        const billingOptions = await BillingOption.findAll()

        res.status(200).json(billingOptions)
    }catch(err){
        logData('BillingOptions: ' + err)
        next(err)
    }
}

const PatientActivities = async(req, res, next) => {
    try{
        const activities = await PatientActivity.findAll()

        res.status(200).json(activities)
    }catch(err){
        logData('PatientActivities: ' + err)
        next(err)
    }
}

const InsuranceCompanies = async(req, res, next) => {
    try{
        const insurers = await Insurer.findAll()

        res.status(200).json(insurers)
    }catch(err){
        logData('InsuranceCompanies: ' + err)
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
        const regions =  await  TenantRegion. findAll()
        const payment_statuses = await PaymentStatus.findAll()
        const countries = await TenantCountry.findAll()
        const contact_types = await ContactType.findAll()


        const order_statutes = await OrderStatus.findAll()
        const  appointment_statuses = await AppointmentStatus.findAll()
        const appointment_types = await AppointmentType.findAll()
        const blood_groups = await BloodGroup.findAll()
        const curriences = await Currrency.findAll()
        const departments = await Department.findAll()
        const employment_types = await EmploymentType.findAll()
        const genders = await Gender.findAll()
        const id_types = await IDType.findAll()
        const marital_statuses = await MaritalStatus.findAll()
        const priorities = await Priority.findAll()
        const specializations = await Specialization.findAll()

        const patient_activities = await PatientActivity.findAll()
        const billing_options = await BillingOption.findAll()
        const insurers = await Insurer.findAll()


        
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
            order_statutes,

            appointment_statuses,
            appointment_types,
            blood_groups,
            curriences,
            departments,
            employment_types,
            genders,
            id_types,
            marital_statuses,
            priorities,
            specializations,

            patient_activities,
            billing_options,
            insurers
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

    AppointmentStatuses,
    AppointmentTypes,
    BloodGroups,
    Currencies,
    Departments,
    EmploymentTypes,
    Genders,
    IdTypes,
    MaritalStatuses,
    Priorities,
    Specializations,
    OrderStatuses,
    GetLookupsAll,

    BillingOptions,
    PatientActivities,
    InsuranceCompanies
    
}