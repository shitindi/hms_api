const Joi = require('@hapi/joi')

const medicineSchema = Joi.object({
    id: Joi.number().allow(null),
    tenant_id: Joi.number().required(),
    name: Joi.string().max(100).required(),
    generic_name: Joi.string().max(100).allow(null),
    brand_name: Joi.string().max(100).allow(null),
    form_id: Joi.number().allow(null),
    strength: Joi.string().max(100).allow(null),
    unit: Joi.string().max(100).allow(null),
    manufacturer: Joi.string().max(100).allow(null),
    description: Joi.string().max(300).allow(null),
    price: Joi.number().allow(null),
    is_active: Joi.boolean().default(true),
    created_by: Joi.number().required()
}).options({ stripUnknown: true })


const prescriptionSchema = Joi.object({

    prescription_items: Joi.array().items({
        id: Joi.number().allow(null),
        appointment_id: Joi.number().required(),
        medicine_id: Joi.number().required(),
        dosage: Joi.string().max(100).required(),
        frequency: Joi.string().max(100).allow(null),
        duration: Joi.string().max(100).allow(null),
        quantity: Joi.number().allow(null),
        instructions: Joi.string().max(1000).allow(null),
        status_id: Joi.number().required().default(1),
        pyament_status: Joi.number().default(1).allow(null)
    })

})
    .options({ stripUnknown: true })
module.exports = {
    medicineSchema,
    prescriptionSchema
}//2 6 17 