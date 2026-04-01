const Joi = require('@hapi/joi')


const doctorSchema = Joi.object({
    id: Joi.number().allow(null),
    doctor_id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    user_id: Joi.number().required(),
    id_type: Joi.number().allow(null),
    id_number: Joi.string().max(20).min(3).allow(null),
    doctor_id_no: Joi.string().max(20).min(3).allow(null),
    license_number: Joi.string().max(20).min(3).allow(null),
    specialization: Joi.number(),
    hightest_qualification: Joi.string().max(100).min(3).allow(null),
    year_of_experience: Joi.number(),
    employment_type: Joi.number(),
    joining_date: Joi.date(),
    is_active: Joi.bool().default(false)

}).options({stripUnknown: true}).options({stripUnknown: true})

module.exports = {doctorSchema}