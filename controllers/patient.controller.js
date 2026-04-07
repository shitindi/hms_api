
const createError = require('http-errors');
const { Op } = require("sequelize");
const { logData, logUserActivity, } = require('../helpers/logger');

const { sequelize } = require('../helpers/sequelize_init');
const { contactSchema } = require("../helpers/validator/auth_validation_schema");
const {patientSchema} = require('../helpers/validator/patient_validation_schema')
const {Patient: Patients} = require('../models/Main/Patient')
const {Contact: Contacts} = require('../models/Auth/Contact');
const { IDType } = require('../models/Lookup/IDType');
const { MaritalStatus } = require('../models/Lookup/MaritalStatus');
const { BloodGroup } = require('../models/Lookup/BloodGroup');
const { PatientActivity } = require('../models/Lookup/PatientActivity');
const { Insurer } = require('../models/Main/Insurer');
const { User } = require('../models/Auth/User');
const { Gender } = require('../models/Lookup/Gender');

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
                        model: Contacts, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Contacts, as: 'Contact',
                        include: [
                            {
                                model: Gender, as: 'Gender'
                            }
                        ]
                },
                {
                    model: IDType, as: 'IdType',
                }, 
                {
                    model: MaritalStatus, as: 'MaritalStatus'
                },
                {
                    model: BloodGroup, as: 'BloodGroup'
                },
                {
                    model: PatientActivity, as: 'CurrentActivity'
                },
                {
                    model: Insurer, as: 'Insurer'
                }
            ]

            })

        } else {
            // no parameter is passed
            patients = await Patients.findAll({
                where: { tenant_id: tenantId },
                order: [['id', 'DESC']],
                include: [{
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Contacts, as: 'Contact',
                        include: [
                            {
                                model: Gender, as: 'Gender'
                            }
                        ]
                },
                {
                    model: IDType, as: 'IdType',
                }, 
                {
                    model: MaritalStatus, as: 'MaritalStatus'
                },
                {
                    model: BloodGroup, as: 'BloodGroup'
                },
                {
                    model: PatientActivity, as: 'CurrentActivity'
                },
                {
                    model: Insurer, as: 'Insurer'
                }
            ]

            })
        }


        await logUserActivity(userId, 12, 4, true)

        res.status(200).json(
            patients
        )

    } catch (err) {
        logData('getPatient: ' + err)
        next(err)
    }
}

const editPatient = async (req, res, next) => {
       const transaction = await sequelize.transaction()
    try {

        let patient = await patientSchema.validateAsync(req.body)
        let contact = await contactSchema.validateAsync(req.body)
       patient.id = patient.id == 0 ? null : patient.id
        contact.id =contact.id == 0 ? null : contact.id

      
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
                    patient, { where: { id: existPatient.id } },{ transaction }
                )

                const Contact = await Contacts.findOne({
                    where: { id: patient?.contact_id ?? 0 }
                })

                if (Contact && Contact.id == existPatient.contact_id) {
                    contact.id = existPatient.contact_id
                    await Contacts.update(
                        contact, {
                            where: { id: existPatient.contact_id }
                    },{ transaction }
                    )
                    
                    }
                    action = 2
                }
            } else {
            // Otherwise create new group
       
            if (!patient.contact_id || !(patient.contact_id > 0)) {
                contact.id = null
                contact = await Contacts.create(contact, { transaction })
                patient.contact_id = contact.id

            }
            patient = await Patients.create(patient, { transaction })
            action = 1
        }

    
        await logUserActivity(userId, 12, action, true, patient.id)

        transaction.commit()
        res.status(200).json({
            ...patient,
            message: "Patient details updated successfuly!",
        })



    } catch (err) {

        transaction.rollback()
        logData('createPatient: +' + err)
        next(err)
    }
}

module.exports = {
    patientDetails,
    editPatient
}
