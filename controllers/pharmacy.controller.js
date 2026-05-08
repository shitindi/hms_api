
const createError = require('http-errors');
const { Op } = require("sequelize");
const { logData, logUserActivity, } = require('../helpers/logger');

const { sequelize } = require('../helpers/sequelize_init');
const { Medicine: Medicines } = require('../models/Main/Medicine');
const { User } = require('../models/Auth/User');
const { Contact } = require('../models/Auth/Contact');
const { MedicineForm } = require('../models/Lookup/Medicineform');
const { medicineSchema, prescriptionSchema } = require('../helpers/validator/pharmacy_validation_schema');
const { Prescription: Prescriptions } = require('../models/Main/Prescription');
const { PrescriptionStatus } = require('../models/Lookup/PrescriptionStatus');
const { PaymentStatus } = require('../models/Main/PaymentStatus');
const { Appointment } = require('../models/Main/Apointment');
const { AppointmentChecklist } = require('../models/Main/AppointmentChecklist');



const medicineDetails = async (req, res, next) => {

    try {
        const medicineId = req.params.id;
        const { userId, tenantId } = req.jwtPayload;
        let Medicine = null;

        if (medicineId && medicineId > 0) {
            // parameter is passed
            Medicine = await Medicines.findOne({
                where: { id: medicineId, tenant_id: tenantId },
                include: [{
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: MedicineForm, as: 'Form'
                },

                ]

            })

        } else {
            // no parameter is passed
            Medicine = await Medicines.findAll({
                where: { tenant_id: tenantId },
                include: [{
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: MedicineForm, as: 'Form'
                },

                ]

            })
        }


        await logUserActivity(userId, 15, 4, true)

        res.status(200).json(
            Medicine
        )

    } catch (err) {
        logData('patientDetails: ' + err)
        next(err)
    }
}

const editMedicine = async (req, res, next) => {
    try {

        let medicine = await medicineSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;

        const Medicine = await Medicines.findOne({
            where: { [Op.and]: { name: medicine.name, tenant_id: group.tenant_id } }
        });
        const existMedicine = await Medicines.findOne({
            where: { [Op.and]: { id: medicine.id, tenant_id: medicine.tenant_id } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existMedicine) {
            // if ID is present then is for update
            if (medicine.id > 0 && medicine.id == existMedicine.id) {
                await Medicines.update(
                    medicine, { where: { id: existMedicine.id } }
                )
                action = 2
            }


        } else {
            // Otherwise create new group
            if (Medicine)
                next(createError.Conflict('The medicine name already exists!'))

            medicine = await Medicine.create(medicine)
            action = 1
        }


        await logUserActivity(userId, 15, action, true, medicine.id)
        res.status(200).json({
            ...group,
            message: "Medicine details updated successfuly!",
        })

        // const { userId, tenatId} =  req.jwtPayload;


    } catch (err) {
        logData('editMedicine: +' + err)
        next(err)
    }
}


const appointmentPrescription = async (req, res, next) => {

    try {
        const appointmentId = req.params.id;
        const { userId, tenantId } = req.jwtPayload;
        let Prescription = [];

        if (appointmentId && appointmentId > 0) {
            // parameter is passed
            Prescription = await Prescriptions.findAll({
                where: { appointment_id: appointmentId },
                include: [{
                    model: Medicines, as: "Medicine",
                    attributes: ['id', 'name', 'generic_name', 'brand_name', 'manufacturer'],
                    include: [
                        {
                            model: MedicineForm, as: 'Form'
                        }
                    ]
                },
                {
                    model: PrescriptionStatus, as: 'Status'
                },
                {
                    model: PaymentStatus, as: 'PaymentStatus'
                },
                {
                    model: Appointment, as: 'Appointment',
                    where: { appointment_status: 3 },
                    required: true,
                    attributes: ['id', 'appointment_status']
                }
                ]

            })

        }


        await logUserActivity(userId, 15, 4, true)

        res.status(200).json(
            Prescription
        )

    } catch (err) {
        console.error('++++++++++++++++++++++: ', err)
        logData('appointmentPrescription: ' + err)
        next(err)
    }
}


const editPrescription = async (req, res, next) => {
    const transaction = await sequelize.transaction()

    try {

        let prescription = await prescriptionSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        const appointmentId = prescription?.prescription_items[0]?.appointment_id ?? -1

        const existPrescription = await Prescriptions.findOne({
            where: { appointment_id: appointmentId }
        });

         const Checklist = await AppointmentChecklist.findOne({
            where: { appointment_id: preDiagnosis.appointment_id }
        })


        let action = 0;
        if (existPrescription) {
            // if ID is present then is for update
            if (appointmentId > 0 && appointmentId == existPrescription.appointment_id) {

                // delete tests items then add new one
                await Prescriptions.destroy({
                    where: { appointment_id: appointmentId }                
                }, {transaction})

                await Prescriptions.bulkCreate(
                    prescription.prescription_items,
                    {transaction}
                )
                action = 2
            }


        } else {


            const prescription_items = await Prescriptions.bulkCreate(
                prescription.prescription_items,
                {transaction}
            )

            if (Checklist){
                Checklist.patient_prescibed= true
                Checklist.save({transaction})
            }
            action = 1
        }


        await logUserActivity(userId, 16, action, true, appointmentId)

        transaction.commit()
        res.status(200).json({
            ...prescription,
            message: "Prescription details updated successfuly!",
        })



    } catch (err) {
        transaction.rollback()
        logData('editPrescription: +' + err)
        next(err)
    }
}


module.exports = {
    medicineDetails,
    editMedicine,
    appointmentPrescription,
    editPrescription
}
