const Joi = require('@hapi/joi')

const authSchema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required()
})

const passUpdate = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password:  Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.ref('newPassword')
}).with('newPassword','confirmPassword')

module.exports = {
    authSchema,
    passUpdate
}