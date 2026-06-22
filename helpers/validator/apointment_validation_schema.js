const Joi = require('@hapi/joi')


const appointmentSchema = Joi.object({
    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    patient_id: Joi.number().required(),
    visit_type: Joi.number().required(),
    department_id: Joi.number(),
    doctor_id: Joi.number().required(),
    appointment_date: Joi.date().required(),
    priority: Joi.number().default(1),
    appointment_reason: Joi.string().min(3).max(1024).allow(null),
    appointment_status: Joi.number().default(1),
    notification_notes: Joi.string().min(3).max(1024).allow(null),
    sms_notification: Joi.bool().default(false),
    email_notification: Joi.bool().default(false),
    appointment_no: Joi.string().max(20).required(),
    created_by: Joi.number().required(),
    pyament_status: Joi.number().default(1).allow(null),
    pre_diagnosis: Joi.string().allow(null),
    doctor_suggestion: Joi.string().allow(null),
    appointment_fee: Joi.number().allow(null),
    patient_insured: Joi.bool().default(false).allow(null)
}
).options({ stripUnknown: true }).options({ stripUnknown: true })

const preDiagnosisSchema = Joi.object({
    appointment_id: Joi.number().required(),
    appointment_reason: Joi.string().min(3).max(1024).required(),
    pre_diagnosis: Joi.string().allow(null),
    doctor_suggestion: Joi.string().allow(null)
}
).options({ stripUnknown: true }).options({ stripUnknown: true })


const labTestRequestSchema = Joi.object({
    test_items: Joi.array().items({
        id: Joi.number().allow(null),
        appointment_id: Joi.number().required(),
        test_id: Joi.number().required(),
        request_notes: Joi.string().max(300).allow(null),
        request_date: Joi.date().required(),
        pyament_status: Joi.number().default(1).allow(null)
    })
}).options({ stripUnknown: true })

const labTestResultSchema = Joi.object({
    test_items: Joi.array().items({
        id: Joi.number().required(),
        test_result: Joi.string().required().max(100),
        result_status: Joi.string().max(20).allow(null),
        result_notes: Joi.string().max(300).allow(null),
        result_date: Joi.date().required(),
        result_completed: Joi.boolean().default(true) 
    })
}).options({ stripUnknown: true })

const labTestResultSingleSchema = Joi.object({
        id: Joi.number().required(),
        test_result: Joi.string().required().max(100),
        result_status: Joi.string().max(20).allow(null),
        result_notes: Joi.string().max(300).allow(null),
        result_date: Joi.date().required(),
        result_completed: Joi.boolean().default(true) 
}).options({ stripUnknown: true })

module.exports = {
     appointmentSchema,
     labTestRequestSchema,
     labTestResultSchema,
     labTestResultSingleSchema,
     preDiagnosisSchema
    
    }

