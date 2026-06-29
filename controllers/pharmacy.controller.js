
const createError = require('http-errors');
const { Op, Sequelize } = require("sequelize");
const { logData, logUserActivity, } = require('../helpers/logger');

const { sequelize } = require('../helpers/sequelize_init');
const { Medicine: Medicines, Medicine } = require('../models/Main/Medicine');
const { User } = require('../models/Auth/User');
const { Contact } = require('../models/Auth/Contact');
const { MedicineForm } = require('../models/Lookup/Medicineform');
const { medicineSchema, prescriptionSchema, prescriptionDispensingSchema } = require('../helpers/validator/pharmacy_validation_schema');
const { Prescription: Prescriptions, Prescription } = require('../models/Main/Prescription');
const { PrescriptionStatus } = require('../models/Lookup/PrescriptionStatus');
const { PaymentStatus } = require('../models/Main/PaymentStatus');
const { Appointment } = require('../models/Main/Apointment');
const { AppointmentChecklist } = require('../models/Main/AppointmentChecklist');
const { getDateOnly } = require('../helpers/utility');
const { Doctor } = require('../models/Main/Doctor');
const { Priority } = require('../models/Lookup/Priority');
const { Patient } = require('../models/Main/Patient');
const { Gender } = require('../models/Lookup/Gender');


const todayPrescriptionRequests = async (req, res, next) => {

    try {

        const { userId, tenantId } = req.jwtPayload;

        // parameter is passed
        const appointments = await Appointment.findAll({
            where: {
                [Op.and]: [{
                    tenant_id: tenantId,
                    appointment_status: [3],
                    current_activity: [9]
                },
                Sequelize.where(Sequelize.cast(Sequelize.col('appointment_date'), 'date'), getDateOnly(new Date()))]
            },
            // limit: 10,
            order: [['id', 'DESC']],
            include: [

                {
                    model: Doctor, as: "Doctor",
                    attributes: ['id'],
                    include: [{
                        model: User, as: "User",
                        attributes: ['id'],
                        include: [{
                            model: Contact, as: "Contact",
                        }]
                    }]
                },
                {
                    model: Priority, as: 'Priority'
                },
                {
                    model: Patient, as: "Patient",
                    include: [{
                        model: Contact, as: "Contact",
                        attributes: ['id', 'first_name', 'middle_name', 'last_name'],
                        include: [
                            {
                                model: Gender, as: 'Gender'
                            }
                        ]
                    },
                    ]
                }
                ,
                  {
                    model: Prescription, as: 'Prescription',
                    include: [
                        {
                            model: Medicine, as: "Medicine",
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
                        }
                    ]
                },

            ]

        })



        await logUserActivity(userId, 15, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('ERROR: ============================ ', err)
        logData('todayLabRequests: ' + err)
        next(err)
    }
}


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

const editPrescriptionDispense= async (req, res, next) => {
      const transaction = await sequelize.transaction()
    try {

        let dispenses = await prescriptionDispensingSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        let dispenseId = []
        if (!transaction || transaction.length == 0)
            next(createError.NotFound('No Prescription items found!'))

        dispenses.prescription_items.forEach(test => {
            dispenseId.push(test.id)
        })

        const existPrescription= await Prescription.findAll({
            where: { id: [...dispenseId] }
        });

        let action = 0;
        if (existPrescription) {

            let isCompleted = true
            existPrescription.forEach(async (test, index, tests,) => {
                const tst = dispenses.prescription_items.find(t => t.id === test.id)
                if (!tst || tst.status_id ==3)
                    return
                isCompleted  &= (tst.status_id == 2 || tst.status_id==4)
                tests[index].dispense_date = tst.dispense_date
                tests[index].status_id = tst.status_id
               const saved = await tests[index].save(
                
                {transaction})
            })

            if (isCompleted){
              const appointment = await Appointment.findOne({
                where: {id: existPrescription[0].appointment_id}
              })
              if (appointment){
                appointment.current_activity = 10
                await appointment.save({transaction})
              }
               
            }

            action = 2

        } else {

            next(createError.NotFound('No test items found!'))
        }


        await logUserActivity(userId, 15, action, true, dispenseId[0])

        transaction.commit()        
        res.status(200).json({
            ...dispenses,
            message: "Prescription details updated successfuly!",
        })



    } catch (err) {

        transaction.rollback()
        console.error('editLabResults ============================: ', err)
        logData('editLabResults: +' + err)
        next(err)
    }
}


module.exports = {
    todayPrescriptionRequests,
    medicineDetails,
    editMedicine,
    appointmentPrescription,
    editPrescription,
    editPrescriptionDispense
}
