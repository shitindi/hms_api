
const createError = require('http-errors');

const { logData, logUserActivity, } = require('../helpers/logger');

const { Appointment: Appointments } = require('../models/Main/Apointment')
const { AppointmentStatus } = require('../models/Lookup/AppointmentStatus')
const { AppointmentType } = require('../models/Lookup/AppointmentType')
const { Doctor } = require('../models/Main/Doctor')
const { Priority } = require('../models/Lookup/Priority')
const { Patient } = require('../models/Main/Patient');
const { Op, where } = require('sequelize');
const { User } = require('../models/Auth/User');
const { Contact } = require('../models/Auth/Contact');
const { appointmentSchema } = require('../helpers/validator/apointment_validation_schema');
const { Department } = require('../models/Lookup/Department');
const { Gender } = require('../models/Lookup/Gender');
const { BloodGroup } = require('../models/Lookup/BloodGroup');
const { PatientActivity } = require('../models/Lookup/PatientActivity');
const { Insurer } = require('../models/Main/Insurer');


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
                }, {
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
                    },{
                        model: Insurer, as: 'Insurer'
                    },
                    {
                        model: PatientActivity, as: 'CurrentActivity'
                    }
                ]
                },
                {
                    model: User, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contact, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }]
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
                }

                ]

            })
        }


        await logUserActivity(userId, 14, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        logData('appointmentDetails: ' + err)
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
            where: { tenant_id: tenantId, doctor_id: doctorId, appointment_status: [2, 3] },
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
                        model: PatientActivity, as: 'CurrentActivity'
                    },
                    {
                        model: Insurer, as: 'Insurer'
                    }

                    ]
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
                await Appointments.update(
                    appointment, { where: { id: existAppointment.id } }
                )

                const status = appointment.appointment_status
                const currentStatus = existAppointment.appointment_status
                const patient = await Patient.findOne({
                    where: { id: appointment.patient_id }
                })

                if (patient && (status != currentStatus && (status == 2 || status == 3))) {
                    patient.current_activity = 2
                    await Patient.update(
                        patient, {
                        where: { id: patient.id },
                        fields: ['current_activity']
                    },

                    )
                }

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
    try {

        let appointmentId = await req.body?.id ?? -1


        const { userId, tenantId } = req.jwtPayload;

        const Appointment = await Appointments.findOne({
            where: {

                id: appointmentId
            }, order: [['id', 'ASC']],
            attributes: ['id', 'patient_id', 'appointment_status']
        });

        let action = 0;
        // Exist same group name in same tenant
        if (Appointment) {

            // if ID is present then is for update
            if (appointmentId > 0 && appointmentId == Appointment.id) {
                const currentStatus = Appointment.appointment_status
                Appointment .appointment_status=3
                await Appointment.save()
            

                const status = 3
                let patient = await Patient.findOne({
                    where: { id: Appointment.patient_id }
                })

                if (patient && (status != currentStatus && (status == 2 || status == 3))) {
                    patient.current_activity = 2

                    await patient.save()

                }

                action = 2
            }


        } else {
            // Otherwise create new group
            next(createError.NotFound('Could not find appointment'))
        }


        await logUserActivity(userId, 14, action, true, appointmentId)

        res.status(200).json({
            ...Appointment,
            message: "Patiend checked in  successfuly!",
        })



    } catch (err) {

        console.error('ERROR: ', err)
        logData('checkinAppointment: +' + err)
        next(err)
    }
}

module.exports = {
    appointmentDetails,
    appointmentsViewByDoctor,
    editAppointment,
    checkinAppointment
}
