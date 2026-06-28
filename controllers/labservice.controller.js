const { Op, Sequelize } = require("sequelize");
const { Appointment } = require("../models/Main/Apointment");
const { getDateOnly } = require("../helpers/utility");
const { Department } = require("../models/Lookup/Department");
const { Priority } = require("../models/Lookup/Priority");
const { AppointmentStatus } = require("../models/Lookup/AppointmentStatus");
const { Patient } = require("../models/Main/Patient");
const { Contact } = require("../models/Auth/Contact");
const { Gender } = require("../models/Lookup/Gender");
const { LabRequest } = require("../models/Main/LabRequest");
const { LabTestCatalog } = require("../models/Main/LabTestCatalog");
const { LabTestCategory } = require("../models/Lookup/LabTestCategory");
const { Doctor } = require("../models/Main/Doctor");
const { User } = require("../models/Auth/User");
const { logUserActivity, logData } = require("../helpers/logger");
const { LabResultStatus } = require("../models/Lookup/LabResultStatus");
const { LabRequestStatus } = require("../models/Lookup/LabRequestStatus");


const todayLabRequests = async (req, res, next) => {

    try {

        const { userId, tenantId } = req.jwtPayload;





        // parameter is passed
        const appointments = await Appointment.findAll({
            where: {
                [Op.and]: [{
                    tenant_id: tenantId,
                    appointment_status: [3],
                    current_activity: [6]
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
                    model: LabRequest, as: 'LabReqests',
                    required: true,
                    include: [
                        {
                            model: LabTestCatalog, as: 'TestCatalog',
                            include: [
                                {
                                    model: LabTestCategory, as: 'Category'
                                }
                            ]
                        }, 
                        {
                            model: LabResultStatus, as: 'ResultStatus'
                        },
                        {
                            model: LabRequestStatus, as: 'RequestStatus'
                        }
                    ]
                },

            ]

        })



        await logUserActivity(userId, 17, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('ERROR: ============================ ', err)
        logData('todayLabRequests: ' + err)
        next(err)
    }
}

module.exports = {
    todayLabRequests
}