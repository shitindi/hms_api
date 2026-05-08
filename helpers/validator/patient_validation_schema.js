const Joi = require('@hapi/joi')

const patientSchema = Joi.object({

    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    contact_id: Joi.number().allow(null),
    created_by: Joi.number().required(),
    registration_no: Joi.string().max(20).required(),
    id_type: Joi.number().allow(null),
    id_number: Joi.number().allow(null),
    marital_status: Joi.number().required(true).default(1),
    birth_date: Joi.date().required(),
    blood_group: Joi.number().allow(null),
    next_kin_name: Joi.string().min(5).max(100).required(),
    next_kin_type: Joi.string().min(3).max(20).required(),
    next_kin_phone: Joi.string().min(10).max(12).required(),
    joining_date: Joi.date().allow(null),
    insurer_id: Joi.number().allow(null),
    insurance_number: Joi.string().min(5).max(20).allow(null),
    is_active: Joi.bool().required().default(true)
}).options({ stripUnknown: true }).options({ stripUnknown: true })


const patientVitals = Joi.object({

    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    apointment_id: Joi.number().required(),
    date_taken: Joi.date().allow(null),

    temperature: Joi.number().required(),
    bp_systolic: Joi.number().allow(null),
    bp_diastolic: Joi.number().allow(null),
    pulse_rate: Joi.number().allow(null),
    respiratory_rate: Joi.number().allow(null),
    oxygen_saturation: Joi.number().allow(null),
    weight_kg: Joi.number().required(),
    height_cm: Joi.number().allow(null),
    blood_glucose: Joi.number().allow(null),
    notes: Joi.string().max(1000).allow(null),
    created_by: Joi.number().required()

}).options({ stripUnknown: true }).options({ stripUnknown: true })

module.exports = {
    patientSchema,
    patientVitals
}
