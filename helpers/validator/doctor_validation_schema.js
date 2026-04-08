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
    department: Joi.number().allow(null),
    specialization: Joi.number().allow(null),
    hightest_qualification: Joi.string().max(100).min(3).allow(null),
    year_of_experience: Joi.number(),
    employment_type: Joi.number(),
    joining_date: Joi.date(),
    is_active: Joi.bool().default(false)

}).options({stripUnknown: true}).options({stripUnknown: true})

module.exports = {doctorSchema}

/*
    user_name: entity.user_name,
    password: entity.password,
    confirm_password: entity.confirm_password,
    must_change_password: entity?.must_change_password ?? false,
    user_status: entity?.user_status ?? 1,
*/