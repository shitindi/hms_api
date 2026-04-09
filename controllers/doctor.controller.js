const { Doctor: Doctors } = require('../models/Main/Doctor');
const { User: Users } = require('../models/Auth/User')
const { Contact: Contacts } = require('../models/Auth/Contact');
const { IDType } = require('../models/Lookup/IDType');
const { Department } = require('../models/Lookup/Department');
const { Specialization } = require('../models/Lookup/Specialization');
const { EmploymentType } = require('../models/Lookup/EmploymentType');
const { logData, logUserActivity, } = require('../helpers/logger');
const { Gender } = require('../models/Lookup/Gender');



const doctorDetails = async (req, res, next) => {
    try {
        const doctorId = req.params.id;

        const { userId: logged_user, tenantId } = req.jwtPayload;

        let doctorList = null;

        if (doctorId && doctorId > 0) {
            doctorList = await Doctors.findOne({
                where: { id: doctorId, tenant_id: tenantId },
                include: [
                    {
                        model: Users, as: 'User',
                        attributes: { exclude: ['password'] },
                        include: [
                            {
                                model: Contacts, as: 'Contact',
                                include: [
                                    {
                                        model: Gender, as: 'Gender'
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                        model: IDType, as: 'IdType',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: Department, as: 'Department',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: Specialization, as: 'Specialization',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: EmploymentType, as: 'EmploymentType',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: Users, as: "CreatedBy",
                        include: [{
                            model: Contacts,
                            attributes: ['id', 'first_name', 'last_name']
                        }]
                    },


                ]
            })
        } else {
            doctorList = await Doctors.findAll({
                where: { tenant_id: tenantId },
                include: [
                    {
                        model: Users, as: 'User',
                        attributes: { exclude: ['password'] },

                        include: [
                            {
                                model: Contacts, as: 'Contact',
                                include: [
                                    {
                                        model: Gender, as: 'Gender'
                                    }
                                ]
                            }
                        ]
                    }
                    ,
                    {
                        model: IDType, as: 'IdType',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: Department, as: 'Department',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: Specialization, as: 'Specialization',
                        attributes: ['ID', 'name']
                    },
                    {
                        model: EmploymentType, as: 'EmploymentType',
                        attributes: ['ID', 'name']
                    }, {
                        model: Users, as: "CreatedBy",
                        include: [{
                            model: Contacts,
                            attributes: ['id', 'first_name', 'last_name']
                        }]
                    }

                ],

            })


        }

        await logUserActivity(logged_user, 13, 4, true)

        res.status(200).json(doctorList)
    } catch (err) {
        logData('doctorDetails: ' + err)
        next(err)
    }
}


module.exports = {
    doctorDetails
}