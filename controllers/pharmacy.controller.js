
const createError = require('http-errors');
const { Op } = require("sequelize");
const { logData, logUserActivity, } = require('../helpers/logger');

const { sequelize } = require('../helpers/sequelize_init');
const {Medicine: Medicines} = require('../models/Main/Medicine');
const { User } = require('../models/Auth/User');
const { Contact } = require('../models/Auth/Contact');
const { MedicineForm } = require('../models/Lookup/Medicineform');
const { medicineSchema } = require('../helpers/validator/pharmacy_validation_schema');
const { Prescription: Prescriptions } = require('../models/Main/Prescription');
const { PrescriptionStatus } = require('../models/Lookup/PrescriptionStatus');



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
                where: { appointment_id: appointmentId},
                include: [{
                    model: User, as: "Medicine",
                    attributes: ['id', 'name', 'generic_name', 'brand_name', 'manufacturer'],
                },
                {
                    model: PrescriptionStatus, as: 'Status'
                },
                
                ]

            })

        } 


        await logUserActivity(userId, 15, 4, true)

        res.status(200).json(
            Prescription
        )

    } catch (err) {
        logData('appointmentPrescription: ' + err)
        next(err)
    }
}


module.exports = {
    medicineDetails,
    editMedicine
}
