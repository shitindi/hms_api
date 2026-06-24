
const createError = require('http-errors');
const { Sequelize } = require('sequelize');


const { logData, logUserActivity, } = require('../helpers/logger');

const { Appointment: Appointments, Appointment } = require('../models/Main/Apointment')
const { AppointmentStatus } = require('../models/Lookup/AppointmentStatus')
const { AppointmentType } = require('../models/Lookup/AppointmentType')
const { Doctor } = require('../models/Main/Doctor')
const { Priority } = require('../models/Lookup/Priority')
const { Patient } = require('../models/Main/Patient');
const { Op, where } = require('sequelize');
const { User } = require('../models/Auth/User');
const { Contact } = require('../models/Auth/Contact');
const { appointmentSchema, labTestRequestSchema, labTestResultSchema, labTestResultSingleSchema, preDiagnosisSchema } = require('../helpers/validator/apointment_validation_schema');
const { Department } = require('../models/Lookup/Department');
const { Gender } = require('../models/Lookup/Gender');
const { BloodGroup } = require('../models/Lookup/BloodGroup');
const { PatientActivity } = require('../models/Lookup/PatientActivity');
const { Insurer } = require('../models/Main/Insurer');
const { getDateOnly } = require('../helpers/utility');
const { PatientVital } = require('../models/Main/PatientVital');
const { LabRequest } = require('../models/Main/LabRequest');
const { LabTestCatalog } = require('../models/Main/LabTestCatalog');
const { LabResultStatus } = require('../models/Lookup/LabResultStatus');
const { Prescription } = require('../models/Main/Prescription');
const { Medicine } = require('../models/Main/Medicine');
const { MedicineForm } = require('../models/Lookup/Medicineform');
const { PrescriptionStatus } = require('../models/Lookup/PrescriptionStatus');
const { LabTestCategory } = require('../models/Lookup/LabTestCategory');
const { sequelize } = require('../helpers/sequelize_init');
const { PaymentStatus } = require('../models/Main/PaymentStatus');
const { AppointmentChecklist } = require('../models/Main/AppointmentChecklist');
const { PreDiagnosis } = require('../models/Main/PreDiagnosis');
const { PatientDiseaseHistory } = require('../models/Main/PatientDiseaseHistory');
const { Disease } = require('../models/Lookup/MedicalDisease');
const { PatientSymptom } = require('../models/Main/PatientSymptom');
const { Symptom } = require('../models/Lookup/Symptoms');


const appointmentDetails = async (req, res, next) => {
    try {
        const appointmentId = req.params.id;
        const { userId, tenantId } = req.jwtPayload;

        let appointments = null;

        if (appointmentId && appointmentId > 0) {
            // parameter is passed
            appointments = await Appointments.findOne({
                where: { id: appointmentId, tenant_id: tenantId },
                include: [{
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
                    model: Department, as: 'Department',
                },
                {
                    model: AppointmentType, as: 'AppointmentType',
                },
                {
                    model: Priority, as: 'Priority'
                },
                {
                    model: PatientVital, as: 'PatientVital'
                }
                    ,
                {
                    model: AppointmentStatus, as: 'AppointmentStatus'
                },
                {
                    model: PatientActivity, as: 'PatientActivity'
                }
                    ,
                {
                    model: Patient, as: "Patient",
                    include: [{
                        model: Contact, as: "Contact",
                        include: [
                            {
                                model: Gender, as: 'Gender'
                            }
                        ]
                    },
                    {
                        model: BloodGroup, as: 'BloodGroup'
                    },
                    {
                        model: Insurer, as: 'Insurer'
                    },
    
                    ]

                },
                {
                    model: LabRequest, as: 'LabReqests',
                    include: [
                        {
                            model: LabTestCatalog, as: 'TestCatalog',
                            include: [
                                {
                                    model: LabTestCategory, as: 'Category'
                                }
                            ]
                        }
                    ]
                },
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
                        }
                    ]
                }
                    ,
                {
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: PaymentStatus, as: 'PaymentStatus'
                },
                    {
                        model: PreDiagnosis, as: 'PreDiagnosis',
                        include: [
                            {
                                model: PatientDiseaseHistory, as: 'DiseaseHistory',
                                include: [
                                    {
                                        model: Disease, as: 'Disease'
                                    }
                                ]
                            },
                            {
                                model: PatientSymptom, as: 'PatientSymptoms',
                                include: [
                                    {
                                        model: Symptom, as: 'Symtomps'
                                    }
                                ]
                            }
                        ]
                    }

                ]

            })

        } else {
            // no parameter is passed
            appointments = await Appointments.findAll({
                where: { tenant_id: tenantId },
                order: [['id', 'ASC']],
                include: [{
                    model: Doctor, as: "Doctor",
                    attributes: ['id'],
                    include: [{
                        model: User, as: "User",
                        attributes: ['id'],
                        include: [{
                            model: Contact, as: "Contact",
                            attributes: ['id', 'first_name', 'last_name']
                        }]
                    }]
                },
                {
                    model: Department, as: 'Department',
                },
                {
                    model: AppointmentType, as: 'AppointmentType',
                },
                {
                    model: Priority, as: 'Priority'
                },
                {
                    model: AppointmentStatus, as: 'AppointmentStatus'
                },
                {
                    model: Patient, as: "Patient",
                    attributes: ['id'],
                    include: [{
                        model: Contact, as: "Contact",
                        attributes: ['id', 'first_name', 'last_name'],
                    }]
                },
                {
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },

                {
                    model: PaymentStatus, as: 'PaymentStatus'
                }

                ]

            })
        }


        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('APPOINT: ', err)
        logData('appointmentDetails: ' + err)
        next(err)
    }
}

const todayAppointments = async (req, res, next) => {
    try {
        const { userId, tenantId } = req.jwtPayload;

        let appointments = null;


        // no parameter is passed
        appointments = await Appointments.findAll({
            where: {
                [Op.and]: [{ tenant_id: tenantId },
                { appointment_status: [1, 2, 3] },
                Sequelize.where(Sequelize.cast(Sequelize.col('appointment_date'), 'date'), getDateOnly(new Date()))]
            },
            order: [['id', 'ASC']],
            include: [{
                model: Doctor, as: "Doctor",
                attributes: ['id'],
                include: [{
                    model: User, as: "User",
                    attributes: ['id'],
                    include: [{
                        model: Contact, as: "Contact",
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                }]
            },
            {
                model: Department, as: 'Department',
            },
            {
                model: AppointmentType, as: 'AppointmentType',
            },
            {
                model: Priority, as: 'Priority'
            },
            {
                model: AppointmentStatus, as: 'AppointmentStatus'
            },
            {
                model: Patient, as: "Patient",
                attributes: ['id'],
                include: [{
                    model: Contact, as: "Contact",
                    attributes: ['id', 'first_name', 'last_name'],
                }]
            },
            {
                model: User, as: "CreatedBy",
                attributes: ['id', 'user_name'],
                include: [{
                    model: Contact, as: 'Contact',
                    attributes: ['id', 'first_name', 'last_name']
                }]
            },

            {
                model: PaymentStatus, as: 'PaymentStatus'
            },
            {
                model: PatientActivity, as: 'PatientActivity'
            }

            ]

        })



        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('APPOINT: ', err)
        logData('appointmentDetails: ' + err)
        next(err)
    }
}


const visingHistory = async (req, res, next) => {
    try {
        const patientId = req.params.id;
        const { userId, tenantId } = req.jwtPayload;

        let appointments = null;

        if (patientId && patientId > 0) {
            // parameter is passed
            appointments = await Appointments.findAll({
                where: { patient_id: patientId, tenant_id: tenantId },
                attributes: ['id', 'appointment_date', 'appointment_reason'],
                include: [{
                    model: Doctor, as: "Doctor",
                    attributes: ['id'],
                    include: [{
                        model: User, as: "User",
                        attributes: ['id'],
                        include: [{
                            model: Contact, as: "Contact",
                            attributes: ['first_name', 'last_name']
                        }]
                    }]
                },
                {
                    model: Department, as: 'Department',
                },

                {
                    model: LabRequest, as: 'LabReqests',
                    attributes: ['id'],
                    include: [
                        {
                            model: LabTestCatalog, as: 'TestCatalog',
                            attributes: ['id', 'test_name']
                        }
                    ]
                },
                {
                    model: Prescription, as: 'Prescription',
                    attributes: ['id'],
                    include: [
                        {
                            model: Medicine, as: "Medicine",
                            attributes: ['id', 'name'],
                        },
                    ]
                }

                ]

            })

        }

        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('THE DATA: ', err)
        logData('visingHistory: ' + err)
        next(err)
    }
}
const appointmentsViewByDoctor = async (req, res, next) => {

    try {

        const { userId, tenantId } = req.jwtPayload;

        const doctor = await Doctor.findOne(
            {
                where: { user_id: userId },
                attributes: ['id']
            }
        )

        const doctorId = 0 // = doctor?.id ?? -1



        // parameter is passed
        const appointments = await Appointments.findAll({
            where: {
                [Op.and]: [{ tenant_id: tenantId, doctor_id: doctorId, appointment_status: [3] },
                Sequelize.where(Sequelize.cast(Sequelize.col('appointment_date'), 'date'), getDateOnly(new Date()))]
            },
            // limit: 10,
            order: [['id', 'DESC']],
            include: [
                {
                    model: Department, as: 'Department',
                },
                {
                    model: AppointmentType, as: 'AppointmentType',
                },
                {
                    model: Priority, as: 'Priority'
                },

                {
                    model: PatientActivity, as: 'PatientActivity'
                },
                {
                    model: AppointmentStatus, as: 'AppointmentStatus'
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
                    {
                        model: BloodGroup, as: 'BloodGroup'
                    },
                    {
                        model: Insurer, as: 'Insurer'
                    }

                    ]
                }
                ,
                {
                    model: PaymentStatus, as: 'PaymentStatus'
                }
            ]

        })



        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        logData('appointmentDetails: ' + err)
        next(err)
    }
}

const editAppointment = async (req, res, next) => {
    try {

        let appointment = await appointmentSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        appointment.tenant_id = tenantId

        const Appointment = await Appointments.findOne({
            where: {
                [Op.and]: {
                    patient_id: appointment.patient_id, tenant_id: appointment.tenant_id, doctor_id: appointment.doctor_id, appointment_date: appointment.appointment_date
                }
            }
        });

        const existAppointment = await Appointments.findOne({
            where: { [Op.and]: { id: appointment?.id ?? -1, tenant_id: appointment.tenant_id } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existAppointment) {
            // if ID is present then is for update
            if (appointment.id > 0 && appointment.id == existAppointment.id) {

                const status = appointment.appointment_status
                const currentStatus = existAppointment.appointment_status

                if (status != currentStatus && (status == 2 || status == 3)) {
                    appointment.current_activity = 2

                }
                await Appointments.update(
                    appointment, { where: { id: existAppointment.id } }
                )

                action = 2
            }


        } else {
            // Otherwise create new group
            if (Appointment)
                next(createError.Conflict('Patient appointment with doctor on specified date already exists!'))

            appointment = await Appointments.create(appointment)
            action = 1
        }


        await logUserActivity(userId, 14, action, true, appointment.id)

        res.status(200).json({
            ...appointment,
            message: "Appointment details updated successfuly!",
        })



    } catch (err) {

        logData('createAppointment: +' + err)
        next(err)
    }
}

const checkinAppointment = async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {

        let appointmentId = await req.body?.id ?? -1


        const { userId, tenantId } = req.jwtPayload;

        const Appointment = await Appointments.findOne({
            where: {

                id: appointmentId
            }, order: [['id', 'ASC']],
            attributes: ['id', 'patient_id', 'appointment_status']
        });

        const Checklist = await AppointmentChecklist.findOne({
            where: { appointment_id: appointmentId }
        })

        let action = 0;
        // Exist same group name in same tenant
        if (Appointment) {

            // if ID is present then is for update
            if (appointmentId > 0 && appointmentId == Appointment.id) {
                const currentStatus = Appointment.appointment_status
                const status = 3
                if (status != currentStatus && (status == 2 || status == 3)) {
                    Appointment.current_activity = 2
                }

                Appointment.appointment_status = 3
                await Appointment.save({ transaction })

                if (!Checklist) {
                    await AppointmentChecklist.create(
                        { appointment_id: appointmentId },
                        { transaction }
                    )
                }
                action = 2
            }


        } else {
            // Otherwise create new group
            next(createError.NotFound('Could not find appointment'))
        }


        await logUserActivity(userId, 14, action, true, appointmentId)

        transaction.commit()
        res.status(200).json({
            ...Appointment,
            message: "Patiend checked in  successfuly!",
        })



    } catch (err) {
        transaction.rollback()
        console.error('ERROR: ', err)
        logData('checkinAppointment: +' + err)
        next(err)
    }
}

const viewLabRequests = async (req, res, next) => {

    try {

        const appointmentId = req.params.id;

        const { userId, tenantId } = req.jwtPayload;

        // parameter is passed
        const appointments = await LabRequest.findAll({
            where: { appointment_id: appointmentId },

            include: [
                {
                    model: LabTestCatalog, as: 'TestCatalog'
                },

                {
                    model: LabResultStatus, as: 'ResultStatus'
                },

                {
                    model: PaymentStatus, as: 'PaymentStatus'
                },
                {
                    model: Appointment, as: 'Appointment',
                    where: { appointment_status: 3 },
                    attributes: ['id', 'appointment_status'],
                    required: true
                }
            ]

        })



        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        logData('appointmentDetails: ' + err)
        next(err)
    }
}

const editLabRequests = async (req, res, next) => {
    const transaction = await sequelize.transaction()

    try {

        let labTests = await labTestRequestSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        const appointmentId = labTests?.test_items[0]?.appointment_id ?? -1

        const existLabTest = await LabRequest.findOne({
            where: { appointment_id: appointmentId }
        });

        const Checklist = await AppointmentChecklist.findOne({
            where: { appointment_id: preDiagnosis.appointment_id }
        })

        let action = 0;
        if (existLabTest) {
            // if ID is present then is for update
            if (appointmentId > 0 && appointmentId == existLabTest.appointment_id) {

                // delete tests items then add new one
                await LabRequest.destroy({
                    where: { appointment_id: appointmentId }
                }, { transaction })

                await LabRequest.bulkCreate(
                    labTests.test_items, { transaction }
                )
                action = 2
            }


        } else {

            const test_items = await LabRequest.bulkCreate(
                labTests.test_items,
                { transaction }
            )

            await Appointment.update(
                { current_activity: 6 },
                { where: { id: appointmentId } },
                { transaction }

            )

            if (Checklist) {
                Checklist.is_lab_requested = true
                Checklist.save({ transaction })
            }
            action = 1
        }


        await logUserActivity(userId, 16, action, true, appointmentId)

        transaction.commit()
        res.status(200).json({
            ...labTests,
            message: "Lab test details updated successfuly!",
        })



    } catch (err) {
        transaction.rollback()
        logData('editLabRequests: +' + err)
        next(err)
    }
}

const editLabResults = async (req, res, next) => {
    try {

        let labTests = await labTestResultSchema.validateAsync(req.body)

        const { userId, tenantId } = req.jwtPayload;
        let testIds = []
        if (!labTests || labTests.length == 0)
            next(createError.NotFound('No test items found!'))

        labTests.test_items.forEach(test => {
            testIds.push(test.id)
        })

        const existLabTest = await LabRequest.findAll({
            where: { id: [...testIds] }
        });

        let action = 0;
        if (existLabTest) {

            existLabTest.forEach(async (test, index, tests,) => {
                const tst = labTests.test_items.find(t => t.id === test.id)
                if (!tst)
                    return

                tests[index].test_result = tst.test_result
                tests[index].result_status = tst.result_status
                tests[index].result_date = tst.result_date
                tests[index].result_completed = tst.result_completed
                tests[index].result_notes = tst.result_notes

                await tests[index].save()
            })

            action = 2

        } else {

            next(createError.NotFound('No test items found!'))
        }


        await logUserActivity(userId, 16, action, true, testIds[0])

        res.status(200).json({
            ...labTests,
            message: "Lab test details updated successfuly!",
        })



    } catch (err) {
        logData('editLabResults: +' + err)
        next(err)
    }
}

const editLabResultSingle = async (req, res, next) => {
    try {

        let labTest = await labTestResultSingleSchema.validateAsync(req.body)


        const { userId, tenantId } = req.jwtPayload;

        const LabTest = await LabRequest.findOne({
            where: { id: labTest?.id ?? -1 }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (LabTest) {

            LabTest.test_result = tst.test_result
            LabTest.result_status = tst.result_status
            LabTest.result_date = tst.result_date
            LabTest.result_completed = tst.result_completed
            LabTest.result_notes = tst.result_notes

            await LabTest.save()
            action = 2


        } else {
            // Otherwise create new group
            next(createError.NotFound('Could not find lab rest request'))
        }


        await logUserActivity(userId, 14, action, true, labTest.id)

        res.status(200).json({
            ...labTest,
            message: "Test result updated successfuly!",
        })



    } catch (err) {


        logData('editLabResultSingle: +' + err)
        next(err)
    }
}


const editPreDiagnosis = async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {
        let preDiagnosis = await preDiagnosisSchema.validateAsync(req.body)
        const { userId, tenantId } = req.jwtPayload;



        const Diagnosis = await PreDiagnosis.findOne({
            where: { appointment_id: preDiagnosis.appointment_id }
        })

        const Checklist = await AppointmentChecklist.findOne({
            where: { appointment_id: preDiagnosis.appointment_id }
        })
        let action = 0;
        // Exist same group name in same tenant
        if (Diagnosis) {
            // if ID is present then is for update
            if (preDiagnosis.appointment_id > 0 && preDiagnosis.appointment_id == Diagnosis.appointment_id) {

                await PreDiagnosis.update(
                    preDiagnosis,
                    { transaction }
                )

                if (Checklist) {
                    Checklist.pre_diagnosis_done = true
                    await Checklist.save({ transaction })
                }

                // Delete and add disease history and symtoms
                await PatientSymptom.destroy({
                    where: { diagnosis_id: Diagnosis.id },
                    transaction
                })

                await PatientDiseaseHistory.destroy({
                    where: { diagnosis_id: Diagnosis.id },
                    transaction
                })

                if (preDiagnosis.ros.length > 0) {
                    await PatientSymptom.bulkCreate(
                        preDiagnosis.ros.map(item => {
                            return { diagnosis_id: Diagnosis.id, symptom_id: item }
                        }, { transaction })
                    )
                }

                if (preDiagnosis.past_history.length > 0) {
                    await PatientDiseaseHistory.bulkCreate(
                        preDiagnosis.past_history.map(item => {
                            return { diagnosis_id: Diagnosis.id, disease_id: item }
                        }, { transaction })
                    )
                }
                action = 2
            }


        } else {
            
            await PreDiagnosis.create(
                preDiagnosis, {transaction}
            )

            if (Checklist) {
                    Checklist.pre_diagnosis_done = true
                    await Checklist.save({ transaction })
                }

                if (preDiagnosis.ros.length > 0) {
                    await PatientSymptom.bulkCreate(
                        preDiagnosis.ros.map(item => {
                            return { diagnosis_id: Diagnosis.id, symptom_id: item }
                        }, { transaction })
                    )
                }

                if (preDiagnosis.past_history.length > 0) {
                    await PatientDiseaseHistory.bulkCreate(
                        preDiagnosis.past_history.map(item => {
                            return { diagnosis_id: Diagnosis.id, disease_id: item }
                        }, { transaction })
                    )
                }
            action = 1
        }


        // const { userId, tenatId} =  req.jwtPayload;
        await logUserActivity(userId, 14, action, true, Appointment.id)

        transaction.commit()
        res.status(200).json({
            ...preDiagnosis,
            message: "Pre diagnosis details updated successfuly!",
        })
    } catch (err) {
        transaction.rollback()
        logData('editPreDiagnosis: ' + err)
        next(err)
    }
}


module.exports = {
    appointmentDetails,
    appointmentsViewByDoctor,
    editAppointment,
    checkinAppointment,
    editLabRequests,
    editLabResults,
    editLabResultSingle,
    viewLabRequests,
    visingHistory,
    editPreDiagnosis,
    todayAppointments
}
