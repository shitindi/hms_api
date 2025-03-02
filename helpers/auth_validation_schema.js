const Joi = require('@hapi/joi')

const emailSchema = Joi.object({
    email: Joi.string().email().lowercase().required()
})

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(16).required()
})

const passUpdate = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password:  Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).max(16).required(),
    confirmPassword: Joi.ref('newPassword')
}).with('newPassword','confirmPassword')

const passReset= Joi.object({
    reset_code:  Joi.number().min(8).max(8).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('newPassword')
}).with('newPassword','confirmPassword')


const contactSchema = Joi.object({
    //Contact model
    first_name: Joi.string(30).required(),
    middle_name: Joi.string(30),
    last_name: Joi.string(30).required(),
    email: Joi.string(100).required().email(),
    mobile_no:Joi.string(15).required(),
    phone: Joi.string(15),
    position: Joi.string(100),
    address: Joi.string(150),
    created_by : Joi.number(),
})

const userSchema = Joi.object({
    // User model
    user_name: Joi.string(100).email().required(),
    password: Joi.string().min(6).max(16).required(),
    confirm_password: Joi.ref('password'),
    must_change_password: Joi.bool() ,
    contact_id: Joi.number().required(),
    tenant_id: Joi.number(),
}).with('password','confirm_password')


module.exports = {
    authSchema,
    passUpdate,
    emailSchema,
    passReset,
    contactSchema,
    userSchema
}