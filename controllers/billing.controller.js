const createError = require('http-errors');
const { Sequelize } = require('sequelize');
const { Op, where } = require('sequelize');
const { sequelize } = require('../helpers/sequelize_init');


const { logData, logUserActivity, } = require('../helpers/logger');
const { Prescription } = require('../models/Main/Prescription');
const { Appointment } = require('../models/Main/Apointment');
const { Patient } = require('../models/Main/Patient');
const { Contact } = require('../models/Auth/Contact');
const { PaymentStatus } = require('../models/Main/PaymentStatus');
const { PatientActivity } = require('../models/Lookup/PatientActivity');
const { Medicine } = require('../models/Main/Medicine');
const { LabRequest } = require('../models/Main/LabRequest');
const { LabTestCatalog } = require('../models/Main/LabTestCatalog');
const { getDateOnly, getDbDateNow } = require('../helpers/utility');
const { serviceShcema } = require('../helpers/validator/billing_validation_schema');
const { Billing } = require('../models/Main/Billing');
const { BillingItem } = require('../models/Main/BillingItem');
const { Payment } = require('../models/Main/Payment');

const todayAppointmentsBilling = async (req, res, next) => {
    try {
        const { userId, tenantId } = req.jwtPayload;

        let appointments = null;


        // no parameter is passed
        appointments = await Appointment.findAll({
            where: {
                [Op.and]: [{ tenant_id: tenantId },
                { appointment_status: [2, 3] },
                Sequelize.where(Sequelize.cast(Sequelize.col('appointment_date'), 'date'), getDateOnly(new Date()))]
            },
            order: [['id', 'ASC']],
            include: [
                {
                    model: Patient, as: "Patient",
                    attributes: ['id', 'registration_no'],
                    include: [{
                        model: Contact, as: "Contact",
                        attributes: ['id', 'first_name', 'last_name'],
                    }]
                },
                {
                    model: PaymentStatus, as: 'PaymentStatus'
                },
                {
                    model: PatientActivity, as: 'PatientActivity'
                },
                {
                    model: Prescription, as: 'Prescription',
                  //  where: { pyament_status: [1, 3, 5] },
                    required: false,
                    attributes: ['id', 'quantity','pyament_status'],
                    include: [
                        {
                            model: Medicine, as: 'Medicine',
                            attributes: ['id', 'name', 'price']
                        }
                    ]
                },
                {
                    model: LabRequest, as: 'LabReqests',
                  //  where: { pyament_status: [1, 3, 5] },
                    required: false,
                    attributes: ['id', 'pyament_status'],
                    include: [
                        {
                            model: LabTestCatalog, as: 'TestCatalog',
                            attributes: ['id', 'test_name', 'cost']
                        }
                    ]
                }

            ]

        })



        await logUserActivity(userId, 16, 4, true)

        res.status(200).json(
            appointments
        )

    } catch (err) {
        console.error('APPOINT_BILING: ', err)
        logData('todayAppointmentsBilling: ' + err)
        next(err)
    }
}


const makeServicePayment = async (req, res, next) => {
    const transaction = await sequelize.transaction()

    try {
        let payment = await serviceShcema.validateAsync(req.body)
        const { userId, tenantId } = req.jwtPayload;
        //console.error('USER: ', userId, ', TENANT: ', tenantId)

        let Service = null;
        let BillItem = null
        let action = 1
        let appointment = await Appointment.findOne({
            where: { id: payment.appointment_id }
        })

        if (!appointment) {
            throw createError.NotFound('The appointment specified does not exists!')
        }

        let Bill = await Billing.findOne({
            where: { appointment_id: payment.appointment_id }
        })

        if (!Bill) {

         Bill =  await Billing.create(
                {
                    appointment_id: payment.appointment_id,
                    billing_amount: payment.amount,
                    billing_status: 5,
                    billing_date: getDbDateNow(),
                    created_by: userId
                },
                {transaction}
            )
        }

        BillItem = await BillingItem.findOne({
            where: { service_id: payment.service_id, bill_id: Bill.id }
        })
        let billAmount = 0
        switch (payment.service_id) {

            case 1:
                //Consultation
                billAmount = appointment.appointment_fee
                appointment.pyament_status = 2
               appointment = await appointment.save({transaction})
                break;
            case 2:
                //Laboratory
                const labService = await LabRequest.findAll({
                    where: { appointment_id: appointment.id, pyament_status: [1, 3, 5] },
                    include: [
                        {
                            model: LabTestCatalog, as: 'TestCatalog',
                            attributes: ['cost']
                        }
                    ]
                })
                if (!labService) {
                    throw createError.NotFound('Lab service for this payment could not be found!')
                }

                labService.forEach(async test => {
                    billAmount += Number(test.TestCatalog.cost)
                    test.pyament_status = 2
                    await test.save({transaction})
                })
                break;
            case 3:
                //Pharmacy
                const prescription = await Prescription.findAll({
                    where: { appointment_id: appointment.id, pyament_status: [1, 3, 5] },
                    include: [
                        {
                            model: Medicine, as: 'Medicine',
                            attributes: ['price']
                        }
                    ]
                })
                if (!prescription) {
                    throw createError.NotFound('Prescription for this payment could not be found!')
                }


                prescription.forEach( async prs => {
                    billAmount += Number(prs.Medicine.price) * Number(prs.quantity)

                    prs.pyament_status = 2
                    await prs.save({transaction})
                })
                break;
            case 4:
                //Clinical services
                break;
            case 5:
                // Admission service
                break;
            case 6:
                //Imaging service
                break;
            case 7:
                //Emergency service
                break;
        }

        if (payment.amount > billAmount) {
            throw createError.NotAcceptable('Paid amount exceeded billing amount!!')
        }



        if (!BillItem) {
            await BillingItem.create(
                {
                    bill_id: Bill.id,
                    service_id: payment.service_id,
                    quantity: 1,
                    total_price: billAmount,
                    paid_amount: payment.amount,
                    payment_status: 2
                },
                {transaction}
            )
        } else {

            BillItem.paid_amount += payment.amount
            if (BillItem.paid_amount > billAmount) {
                throw createError.NotAcceptable('Paid amount exceeded billing amount!!')
            }

            BillItem.payment_status = 2
            await BillItem.save({transaction})
            action = 2
        }

       payment =  await Payment.create(
            {
                tenant_id: tenantId,
                payment_method: payment.method,
                amount: payment.amount,
                currency_id: 1,
                bill_id: Bill.id,
                service_id: payment.service_id,
                paid_at: getDbDateNow(),
                created_by: userId,
                notes: payment.notes
            },
            {transaction}
        )

        await logUserActivity(userId, 16, action, true, payment.id)

        transaction.commit()

        res.status(200).json({
            ...payment,
            message: "Payment details updated successfuly!",
        })
    } catch (err) {
        transaction.rollback()
        console.error('PAYMENT: ', err)
        logData('makeServicePayment: ' + err)
        next(err)
    }
}

module.exports = {
    todayAppointmentsBilling,
    makeServicePayment
}