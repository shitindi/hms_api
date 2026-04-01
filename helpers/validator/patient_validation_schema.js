const Joi = require('@hapi/joi')

const patientSchema = Joi.object({    
    
    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(), 
    contact_id: Joi.number().required(),
    id_type: Joi.number().allow(null),
    id_number: Joi.number().allow(null),
    marital_status: Joi.number().required(true).default(1),
    birth_date: Joi.date().required(),
    blood_group: Joi.number().allow(null),
    next_kin_name: Joi.string().min(5).max(100).required(),
    next_kin_type: Joi.string().min(3).max(20).required(),
    next_kin_phone: Joi.string().min(10).max(12).required(),
    joining_date: Joi.date().allow(null),
    is_active: Joi.bool().required().default(true)
})

module.exports = { patientSchema}
