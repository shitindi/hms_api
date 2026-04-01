
const createError = require('http-errors');
const { Op } = require("sequelize");
const { sequelize } = require('../helpers/sequelize_init');
const { contactSchema } = require("../helpers/validator/auth_validation_schema");
const {patientSchema} = require('../helpers/validator/patient_validation_schema')
const {Patient: Patients} = require('../models/Main/Patient')
const {Contact: Contacts} = require('../models/Auth/Contact');
const { IDType } = require('../models/Lookup/IDType');
const { MaritalStatus } = require('../models/Lookup/MaritalStatus');
const { BloodGroup } = require('../models/Lookup/BloodGroup');

const patientDetails = async (req, res, next) => {

    try {
        const patientId = req.params.id;
        const { userId, tenantId } = req.jwtPayload;
        let patients = null;

        if (patientId && patientId > 0) {
            // parameter is passed
            patients = await patients.findOne({
                where: { id: patientId, tenant_id: tenantId },
                include: [{
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Contacts, as: 'Contact',
                },
                {
                    model: IDType, as: 'IdType',
                }, 
                {
                    model: MaritalStatus, as: 'MaritalStatus'
                },
                {
                    model: BloodGroup, as: 'BloodGroup'
                }
            ]

            })

        } else {
            // no parameter is passed
            suppliers = await Suppliers.findAll({
                where: { tenant_id: tenantId },
                include: [{
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Contacts, as: 'Contact',
                },
                {
                    model: IDType, as: 'IdType',
                }, 
                {
                    model: MaritalStatus, as: 'MaritalStatus'
                },
                {
                    model: BloodGroup, as: 'BloodGroup'
                }
            ]

            })
        }


        await logUserActivity(userId, 12, 4, true)

        res.status(200).json(
            suppliers
        )

    } catch (err) {
        logData('getPatient: ' + err)
        next(err)
    }
}

const editPatient = async (req, res, next) => {
    try {

        let patient = await patientSchema.validateAsync(req.body)
        let contact = await contactSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        patient.tenant_id = tenantId

   
        const existPatient = await Patients.findOne({
            where: { [Op.and]: { id: patient.id, tenant_id: tenantId } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existPatient) {
            // if ID is present then is for update
            if (patient.id > 0 && patient.id == existPatient.id) {
                Patients.update(
                    patient, { where: { id: existPatient.id } }
                )

                const Contact = await Contacts.findOne({
                    where: { id: user?.contact_id ?? 0 }
                })

                 if (Contact && Contact.id == existPatient.contact_id) {
                    await Contacts.update(
                        contact, {
                            where: { id: existPatient.contact_id },
                    }
                    )
                    
                    }
                    action = 2
                }
            } else {
            // Otherwise create new group
       

            if (!patient.contact_id || !(patient.contact_id > 0)) {
                contact = await Contacts.create(contact)
                patient.contact_id = contact.id
            }
            patient = await Patients.create(patient)
            action = 1
        }


        await logUserActivity(userId, 12, action, true, patient.id)

        res.status(200).json({
            ...supplier,
            message: "Patient details updated successfuly!",
        })



    } catch (err) {
        logData('createPatient: +' + err)
        next(err)
    }
}

module.exports = {
    patientDetails,
    editPatient
}
