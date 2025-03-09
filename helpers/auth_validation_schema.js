const Joi = require('@hapi/joi')

//Schema for email verification input
const emailSchema = Joi.object({
    email: Joi.string().email().lowercase().required().options({stripUnknown: true})
}).options({stripUnknown: true})

//Schema for login detail
const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(16).required()
}).options({stripUnknown: true})

//Schema for password update
const passUpdate = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password:  Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).max(16).required(),
    confirmPassword: Joi.ref('newPassword')
}).with('newPassword','confirmPassword').options({stripUnknown: true})

//shcema for passwor reset, after receiving reset code
const passReset= Joi.object({
    reset_code:  Joi.number().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('newPassword')
}).with('newPassword','confirmPassword').options({stripUnknown: true})

// Schema for contact object
const contactSchema = Joi.object({
    //Contact model
  //  id: Joi.number(),
    first_name: Joi.string().required().max(30).min(2),
    middle_name: Joi.string().max(30).min(2),
    last_name: Joi.string().required().max(30).min(2),
    email: Joi.string().required().email().max(100),
    mobile_no:Joi.string().required().min(10).max(16),
    phone: Joi.string().min(10).max(17),
    position: Joi.string().max(100),
    address: Joi.string().max(150),
    contact_type: Joi.number().required().default(1),
    created_by : Joi.number(),
}).options({stripUnknown: true}).options({stripUnknown: true})

// Schema for user details
const userSchema = Joi.object({
    // User model
    user_id: Joi.number(),
    user_name: Joi.string().email().required().max(100),
    password: Joi.string().min(6).max(16).required(),
    confirm_password: Joi.ref('password'),
    must_change_password: Joi.bool() ,
    //contact_id: Joi.number().required().default(0),
    tenant_id: Joi.number(),
    user_status: Joi.number().required().default(1)
    
}).with('password','confirm_password').options({stripUnknown: true})

// Schema for group details
const groupSchema = Joi.object({
    id: Joi.number(),
    group_name: Joi.string().required().min(2).max(50),
    tenant_id: Joi.number().required(),
    created_by: Joi.number().required(),
    description: Joi.string().max(300),
    is_active: Joi.bool().required().default(false)
}).options({stripUnknown: true})

const userGroupSchema = Joi.object({
    id: Joi.number(),
    tenant_id: Joi.number().required(),
    user_id: Joi.number().required(),
    group_id: Joi.number().required(),
    created_by: Joi.number().required(),
    is_active: Joi.boolean().required().default(false)
}).options({stripUnknown: true})

const groupPermissionSchema = Joi.object({
     id: Joi.number(),
     module_id: Joi.number().required(),
     tenant_id: Joi.number().required(),
     group_id: Joi.number().required(),
     permission_type: Joi.number().required(),
     created_by: Joi.number().required(),
       is_active: Joi.boolean().required().default(false)
}).options({stripUnknown: true})

const userPermissionSchema = Joi.object({
    id: Joi.number(),
    module_id: Joi.number().required(),
    tenant_id: Joi.number().required(),
    user_id: Joi.number().required(),
       permission_type: Joi.number().required(),
       created_by: Joi.number().required(),
       is_active: Joi.boolean().required().default(false)
}).options({stripUnknown: true})

module.exports = {
    authSchema,
    passUpdate,
    emailSchema,
    passReset,
    contactSchema,
    userSchema,
    groupSchema,
    userGroupSchema,
    groupPermissionSchema,
    userPermissionSchema
}