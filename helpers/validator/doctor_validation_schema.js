const Joi = require('@hapi/joi')


const doctorSchema = Joi.object({
    id: Joi.number().allow(null),
    doctor_id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    user_id: Joi.number().allow(null),
    id_type: Joi.number().allow(null),
    id_number: Joi.string().max(20).min(3).allow(null),
    doctor_id_no: Joi.string().max(20).min(3).allow(null),
    license_number: Joi.string().max(20).min(3).allow(null),
    department: Joi.number().allow(null),
    specialization: Joi.number().allow(null),
    hightest_qualification: Joi.string().max(100).min(2).allow(null),
    employment_type: Joi.number(),
    joining_date: Joi.date(),
    created_by: Joi.number().required(),
    is_active: Joi.bool().default(false),
    consultation_fee: Joi.number().allow(null),
    year_of_experience: Joi.number().required(),
    joining_date: Joi.date().required()

}).options({stripUnknown: true}).options({stripUnknown: true})




module.exports = {doctorSchema}
