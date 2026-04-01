const Joi = require('@hapi/joi')


const appointmentSchema = Joi.object({
    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    patient_id: Joi.number().allow(null),
    visit_type: Joi.number().required(),
    department_id: Joi.number(),
    doctor_id: Joi.number().required(),
    appointment_date: Joi.date().required(),
    priority: Joi.number().default(1),
    appointment_reason: Joi.string().min(10).max(1024).allow(null),
    appointment_status: Joi.number().default(1),
    notification_notes: Joi.string().min(10).max(1024).allow(null),
    sms_notification: Joi.bool().default(false),
    email_notification: Joi.bool().default(false),
    appointment_no: Joi.string().max(20).required()
}
).options({stripUnknown: true}).options({stripUnknown: true})

module.exports = {appointmentSchema}