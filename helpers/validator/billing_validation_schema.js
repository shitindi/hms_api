const Joi = require('@hapi/joi')

const serviceShcema = Joi.object({
    appointment_id : Joi.number().required(),
    service_id: Joi.number().required(),
    amount: Joi.number().required(),
    method: Joi.number().required(),
    reference_no: Joi.string().allow(null),
    notes: Joi.string().allow(null),
}).options({ stripUnknown: true })


module.exports = {
    serviceShcema
}