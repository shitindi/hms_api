const Joi = require('@hapi/joi')

const licensePayment = Joi.object({
       tenant_id: Joi.number().default(0),
        payment_type: Joi.number().required(),
        payment_method: Joi.number().required(),
        amount: Joi.number().required().default(0),
        package: Joi.number()
}).options({stripUnknown: true})

const licensePackage = Joi.object({
    id: Joi.number().default(0),
    package_name: Joi.string().min(10).max(100).required(),
    description: Joi.string().min(10).max(300).required(),
    price: Joi.number().required(),
    app_id: Joi.number().required(),
    created_by: Joi.number().required(),
    is_active: Joi.boolean().default(0)
}).options({stripUnknown: true})

const paymentMethod = Joi.object({
    id: Joi.number().default(0),
    tenant_id: Joi.number().required(),
    name: Joi.string().min(3).max(30).required(),
    account_number: Joi.string().min(6).max(20),
    created_by: Joi.number().required()
}).options({stripUnknown: true})

const licenseCount = Joi.object({
    id: Joi.number().default(0),
        description:Joi.string().min(10).max(30).required(),
        user_count: Joi.number().required(),
        price: Joi.number().required(),
        is_active: Joi.boolean().required().default(false),
        created_by: Joi.number().required()
}).options({stripUnknown: true})


const branchCount = Joi.object({
    id: Joi.number().default(0),
        description:Joi.string().min(10).max(30).required(),
        branch_count: Joi.number().required(),
        price: Joi.number().required(),
        is_active: Joi.boolean().required().default(false),
        created_by: Joi.number().required()
}).options({stripUnknown: true})

const tenantBranchSchema = Joi.object({
    id: Joi.number().default(0),
    tenant_id: Joi.number().required(),
    branch_name: Joi.string().min(2).max(50).required(),
    country_id:Joi.number(),
    region_id: Joi.number(),
    region_name: Joi.string().min(2).max(50),
    Address: Joi.string().min(3).max(100),
    phone: Joi.string().min(10).max(12),
    description: Joi.string().min(10).max(300),
    contact_person: Joi.number().required(),
    is_active: Joi.boolean().required().default(0),
    created_by: Joi.number().required()
}).options({stripUnknown: true})

module.exports = {
    licensePayment,
    licensePackage,
    paymentMethod,
    licenseCount,
    branchCount,
    tenantBranchSchema
}