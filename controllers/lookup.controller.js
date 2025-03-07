const createError = require('http-errors');
const { logData } = require('../helpers/logger');
const {ActivationType} = require('../models/Auth/ActivationType')
const {TenantStatus} = require('../models/Auth/TenantStatus')
const {UserStatus} = require('../models/Auth/UserStatus')
const {PersmissionType} = require('../models/Auth/PermisionType')
const {Module} = require('../models/Auth/Module')


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

module.exports = {
    activationType,
    tenantStatuses,
    userStatuses,
    permissionTypes,
    appModules
}