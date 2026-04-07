const { Doctor: Doctors } = require('../models/Main/Doctor');
const { User: Users } = require('../models/Auth/User')
const { Contact: Contacts } = require('../models/Auth/Contact');
const { IDType } = require('../models/Lookup/IDType');
const { Department } = require('../models/Lookup/Department');
const { Specialization } = require('../models/Lookup/Specialization');
const { EmploymentType } = require('../models/Lookup/EmploymentType');
const { logData, logUserActivity, } = require('../helpers/logger');



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
                        attributes: { exclude: ['password', 'contact_id'] },
                        include: [
                            {
                                model: Contacts, as: 'Contact',
                                attributes: { exclude: ['createdAt', 'updatedAt', 'contact_type', 'created_by'] },
                            }
                        ]
                    }
                    ,
                    {
                        model: IDType, as: 'IdType',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Department, as: 'Department',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Specialization, as: 'Specialization',
                        attributes: ['id', 'name']
                    },
                    {
                        model: EmploymentType, as: 'EmploymentType',
                        attributes: ['id', 'name']
                    },
                    {
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
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
                        attributes: { exclude: ['password', 'contact_id'] },
                        include: [
                            {
                                model: Contacts, as: 'Contact',
                                attributes: { exclude: ['createdAt', 'updatedAt', 'contact_type', 'created_by'] },
                            }
                        ]
                    }
                    ,
                    {
                        model: IDType, as: 'IdType',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Department, as: 'Department',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Specialization, as: 'Specialization',
                        attributes: ['id', 'name']
                    },
                    {
                        model: EmploymentType, as: 'EmploymentType',
                        attributes: ['id', 'name']
                    },{
                     model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
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