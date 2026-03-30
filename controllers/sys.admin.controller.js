const createError = require('http-errors');
const { groupSchema, userSchema, contactSchema, userGroupSchema, groupPermissionSchema, userPermissionSchema } = require('../helpers/auth_validation_schema')
const {licensePackage, paymentMethod, licenseCount, branchCount} = require('../helpers/client_validation_schema')
const { Group: Groups } = require('../models/Auth/Group');
const { User: Users } = require('../models/Auth/User')
const { Contact: Contacts } = require('../models/Auth/Contact');
const { UserStatus } = require('../models/Auth/UserStatus')
const { UserGroup: UserGroups } = require('../models/Auth/UserGroup')
const { GroupPermission: GroupPermissions } = require('../models/Auth/GroupPermission')
const {UserPermission: UserPermissions} = require('../models/Auth/UserPermission')
const { PersmissionType} = require('../models/Auth/PermisionType')
const { Module: Modules } = require('../models/Auth/Module')
const { logData, logUserActivity,  } = require('../helpers/logger');
const { request } = require('express');
const { Tenant: Tenants } = require('../models/Auth/Tenant');
const { TenantStatus} = require('../models/Auth/TenantStatus')
const {UserStatusHistory} = require ('../models/Auth/UserStatusHistory')
const {PasswordHistory} = require('../models/Auth/PasswordHistory')
const {hashPassword} = require('../helpers/hash_data')
const { Op } = require('sequelize');
const { sequelize } = require('../helpers/sequelize_init');
const {getDbDateNow} = require('../helpers/utility');
const { ContactType } = require('../models/Auth/ContactType');

const {LicensePackage} = require('../models/Client/LicensePackage');
const {LicensePaymentMethod} = require('../models/Client/LicensePaymentMethod')
const { Application } = require('../models/Client/Apps');
const {LicenseUserCount} = require('../models/Client/LIcenseUserCount')
const {LicenseBranchCount} = require ('../models/Client/LicenseBranchCount')
const groupDetails = async (req, res, next) => {

    try {
        const groupId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        let groupList = null;

        if (groupId && groupId > 0)  {
            // parameter is passed
            groupList = await Groups.findOne({
                where: { id: groupId},
                include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                }],
            })

        } else {
            // no parameter is passed
            groupList = await Groups.findAll({
                include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts, as: "Contact",
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                }],
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

        await logUserActivity(userId, 2, 4, true)

        res.status(200).json(
            groupList
        )

    } catch (err) {
        logData('getGroups: ' + err)
        next(err)
    }
}

const editGroup = async (req, res, next) => {
    try {

        let group = await groupSchema.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;

    
        const Group = await Groups.findOne({
            where: { [Op.and]: { group_name: group.group_name, tenant_id: group.tenant_id } }
        });

        const existGroup = await Groups.findOne({
            where: { [Op.and]: { id: group.id, tenant_id: group.tenant_id } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existGroup) {
            // if ID is present then is for update
            if (group.id  > 0 && group.id == existGroup.id) {
                Groups.update(
                    group, { where: { id: group.id } }
                )
                action = 2
            }

        } else {
            // Otherwise create new group
            if (Group)
                next(createError.Conflict('The group name already exists!'))

          group =  await Groups.create(group)
          action = 1
        }


        await logUserActivity(userId, 2, action, true, group.id)

        res.status(200).json({
            ...group,
            message: "Group details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;

    } catch (err) {
        logData('createGroup: +' + err)
        next(err)
    }
}

const userGroupDetails = async (req, res, next) => {
    try {
        const userGroupId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;

        let userGroupList = null;

        if (userGroupId && userGroupId>0) {
            // parameter is passed
            userGroupList = await UserGroups.findOne({
                where: { id: userGroupId },
                include: [{
                    model: Users, as: 'User',
                    attributes: ['id', 'user_name'], 
                    include: [
                        {
                        model: Contacts, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                    ]
                } 
                ,
                {
                    model: Groups, as: 'Group'
                }
            ],
            })

        } else {
            // no parameter is passed

            userGroupList = await UserGroups.findAll({
                include: [{
                    model: Users, as: 'User',
                    attributes: ['id', 'user_name'], 
                    include: [
                        {
                        model: Contacts, as: 'Contact',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                    ]
                } 
                ,
                {
                    model: Groups, as: 'Group'
                }
            ],
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

        await logUserActivity(userId, 3, 4, true)

        res.status(200).json(
            userGroupList
        )
    } catch (err) {
        logData('userGroupDetails: ' + err)
        next(err)
    }
}

const editUserGroup = async (req, res, next) => {
    try {
        let userGroup = await userGroupSchema.validateAsync(req.body)
        const { userId, tenantId} =  req.jwtPayload;

    

        const UserGroup = await UserGroups.findOne({
            where: { [Op.and]: { user_id: userGroup.user_id, group_id: userGroup.group_id, tenant_id: userGroup.tenant_id } }
        });

         const existUserGroup = await UserGroups.findOne({
            where: { [Op.and]: { id: userGroup.id,  tenant_id: userGroup.tenant_id } }
        });


        let action = 0;
        // Exist same group name in same tenant
        if (existUserGroup) {
            // if ID is present then is for update
            if (userGroup.id & userGroup.user_id & userGroup.group_id > 0 && userGroup.id == existUserGroup.id) {
                await UserGroups.update(
                    userGroup, { where: { id: userGroup.id } }
                )
                action =2
            }

           
        } else {
            // Otherwise create new group
            if (UserGroup)
                 next(createError.Conflict('The User with specified group already exists!'))

            userGroup = await UserGroups.create(userGroup)
            action=1
        }


       // const { userId, tenatId} =  req.jwtPayload;
        await logUserActivity(userId, 3, action, true, userGroup.id)

        res.status(200).json({
            ...userGroup,
            message: "User Group details updated successfuly!",
        })
    } catch (err) {
        logData('editUserGroup: ' + err)
        next(err)
    }
}

const userDetails = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { userId: logged_user, tenantId} =  req.jwtPayload;

        let userList = null;

        if (userId && userId >0) {
            userList = await Users.findOne({
                where: { id: userId },
                attributes: {exclude: ['password', 'contact_id']},
                include: [{
                    model: Contacts, as: 'Contact',
                    attributes: {exclude: ['createdAt', 'updatedAt', 'contact_type', 'created_by']},
                    include:[
                        {
                            model: Users, as : 'CreatedBy',
                            attributes: ['id','user_name']
                        },
                        {
                            model: ContactType, as: 'ContactType',
                            attributes: ['id', 'name']
                        }
                    ],
        
                },
                {
                    model: UserStatus,  as : 'UserSatus',
                    attributes: ['id', 'name']
                }],
            })
        } else {
            userList = await Users.findAll({
                attributes: {exclude: ['password', 'contact_id']},
                include: [{
                    model: Contacts, as: 'Contact',
                    attributes: {exclude: ['createdAt', 'updatedAt', 'contact_type', 'created_by']},
                    include:[
                        {
                            model: Users, as : 'CreatedBy',
                            attributes: ['id','user_name']
                        },
                        {
                            model: ContactType, as: 'ContactType',
                            attributes: ['id', 'name']
                        }
                    ],
        
                },
                {
                    model: UserStatus,  as : 'UserSatus',
                    attributes: ['id', 'name']
                }],

            })

            // userList.forEach( users => {
            //     users.password = ''
            // })
        }
       // const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(logged_user, 1, 4, true)

        res.status(200).json(userList)
    } catch (err) {
        logData('userDetails: ' + err)
        next(err)
    }
}

    
const editUser = async (req, res, next) => {
    const transaction = await sequelize.transaction()
    try {

        let user = await userSchema.validateAsync(req.body)
        let contact = await contactSchema.validateAsync(req.body)
        const { user_id, tenantId} =  req.jwtPayload;

        const User = await Users.findOne({
            where: { user_name: user.user_name }
        });
         const existUser = await Users.findOne({
            where: { id: user.user_id }
        });


        let action = 0;
        // Exist same user name in same tenant
        if (existUser) {
            // if ID is present then is for update
            if (user.user_id  > 0 && user.id == existUser.id) {
                await Users.update(
                    user, { where: { id: user.user_id } }
                );

                const Contact = await Contacts.findOne({
                    where: { id: user?.contact_id ?? 0 }
                })

                if (Contact && Contact.id == existUser.contact_id) {
                    await Contacts.update(
                        contact, { where: { id: existUser.contact_id },
                        fields: ['must_change_password', 'user_status']
                    }
                    )
                    if (existUser.user_status != user.user_status){
                        const userStatHistory = {
                            user_id: user.id,
                            status_id: user.user_status,
                            description: 'Status changed by tenant admin',
                            event_date: getDbDateNow()
                        }
            
                       await UserStatusHistory.create(userStatHistory, {transaction})
                    }
                    action = 2
                }
            }

           
        } else {
            // Otherwise create new user and contact
           if (User)
                 next(createError.Conflict('The User with specified name already exists!'))
            const newContact = await Contacts.create(contact, {transaction})
            user.contact_id = newContact.id
            const newPassword = await hashPassword(user.password)
            user.password = newPassword
            user.is_active = user.user_status ==1 ? true : false
            user.email_verified = true


            user = await Users.create(user, {transaction})

              //Log first password usage
              const passUsage = {
                user_id: user.id,
                password: newPassword,
                start_date: getDbDateNow() ,
                is_active: true
            
            }

            await PasswordHistory.create(passUsage, {transaction})

            const userStatHistory = {
                user_id: user.id,
                status_id: user.user_status,
                description: 'First time user created by tenant admin',
                event_date: getDbDateNow()
            }

           await UserStatusHistory.create(userStatHistory, {transaction})
            action = 1
        }

       // const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(user_id, 1, action, true, user.id)

        transaction.commit()
        res.status(200).json({
            ...user,
            message: "User details updated successfuly!",
        })
    } catch (err) {
        transaction.rollback()
        logData('editUser: ' + err)
        next(err)
    }
}

const groupPermissionDetails = async (req, res, next) => {
    try {
        const permissionId = req.params.id;
        let permissionList = null;
        const { user_id, tenantId} =  req.jwtPayload;

        if (permissionId && permissionId >0) {
            // parameter is passed
            permissionList = await GroupPermissions.findOne({
                where: { id: permissionId },
                attributes: {exclude: ['created_by', 'module_id', 'group_id', 'permission_type']},
                include: [{
                    model: Users, as: 'CreatedBy',
                    attributes: ['id', 'user_name']
                },
                {
                    model: Modules, as: 'Module',
                    attributes: ['module_name']
                },
                {
                    model: PersmissionType, as: 'PermissionType',
                    attributes: ['id', 'name']
                },
                {
                    model: Groups , as: 'Group',
                    attributes: ['group_name']
                }
                ],
            })

        } else {
            // no parameter is passed
            permissionList = await GroupPermissions.findAll({
                attributes: {exclude: ['created_by', 'module_id', 'group_id', 'permission_type']},
                include: [{
                    model: Users, as: 'CreatedBy',
                    attributes: ['id', 'user_name']
                },
                {
                    model: Modules, as: 'Module',
                    attributes: ['module_name']
                },
                {
                    model: PersmissionType, as: 'PermissionType',
                    attributes: ['id', 'name']
                },
                {
                    model: Groups , as: 'Group',
                    attributes: ['group_name']
                }
                ],
            })
        }


        await logUserActivity(user_id, 4, 4, true)

        res.status(200).json(
            permissionList
        )

    } catch (err) {
        logData('groupPermissionDetails: ' + err)
        next(err)
    }
}

const editGroupPermission = async (req, res, next) => {
    try {
        let groupPermission = await groupPermissionSchema.validateAsync(req.body)
        const { user_id, tenantId} =  req.jwtPayload;

        const GroupPermission = await GroupPermissions.findOne({
            where: { [Op.and]: { module_id:groupPermission.module_id, group_id: groupPermission.group_id,
                                 permission_type: groupPermission.permission_type , tenant_id: groupPermission.tenant_id} }
        });
        const existGroupPermission = await GroupPermissions.findOne({
            where: { [Op.and]: { id:groupPermission.id, tenant_id: groupPermission.tenant_id } }
        });

        let action = 0
        // Exist same group name in same tenant
        if (existGroupPermission) {
            // if ID is present then is for update
            if (groupPermission.id  > 0 && groupPermission.id == existGroupPermission.id) {
                await GroupPermissions.update(
                    groupPermission, { where: { id: existGroupPermission.id } }
                )
                action = 2
            }

           
        } else {
            // Otherwise create new group
            if (GroupPermission)
                 next(createError.Conflict('The Group permission specified already exists!'))
            groupPermission = await GroupPermissions.create(groupPermission)
            action =1
        }

        //const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(user_id, 1, action, true, groupPermission.id)

        res.status(200).json({
            ...groupPermission,
            message: "Group permission details updated successfuly!",
        })
    } catch (err) {
        logData('editGroupPermission: ' + err)
        next(err)
    }
}

const userPermissionDetails = async (req, res, next) => {
    try {
        const permissionId = req.params.id;
        let permissionList = null;
        const { user_id, tenantId} =  req.jwtPayload;

        if (permissionId & permissionId >0) {
            // parameter is passed
            permissionList = await UserPermissions.findOne({
                where: { id: permissionId },
                attributes: { exclude: ['module_id', 'user_id', 'permission_type']},
                include: [{
                    model: Users, as: 'User',
                    attributes: ['id', 'user_name'],
                },
                {
                    model: Modules,  as: 'Module',
                    attributes: ['module_name']
                },
                {
                    model: PersmissionType, as : 'PermissionType',
                    attributes: ['id', 'name']
                },
                
                ],
            })

        } else {
            // no parameter is passed
            permissionList = await UserPermissions.findAll({
                attributes: { exclude: ['module_id', 'user_id', 'permission_type']},
                include: [{
                    model: Users, as: 'User',
                    attributes: ['id', 'user_name'],
                },
                {
                    model: Modules,  as: 'Module',
                    attributes: ['module_name']
                },
                {
                    model: PersmissionType, as : 'PermissionType',
                    attributes: ['id', 'name']
                },
                
                ],
            })
        }

       // const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(user_id, 5, 4, true)

        res.status(200).json(
            permissionList
        )

    } catch (err) {
        logData('userPermissionDetails: ' + err)
        next(err)
    }
}

const editUserPermission = async (req, res, next) => {
    try {
        let userPermission = await userPermissionSchema.validateAsync(req.body)

        const { user_id, tenantId} =  req.jwtPayload;

        const UserPermission = await UserPermissions.findOne({
            where: { [Op.and]: { user_id: userPermission.user_id, permission_type: userPermission.permission_type,
                 module_id: userPermission.module_id , tenant_id: userPermission.tenant_id} }
        });
         const existUserPermission = await UserPermissions.findOne({
            where: { [Op.and]: { id: userPermission.id, tenant_id: userPermission.tenant_id } }
        });

        let action = 0
        // Exist same group name in same tenant
        if (existUserPermission) {
            // if ID is present then is for update
            if (userPermission.id > 0 && userPermission.id == existUserPermission.id) {
                await UserPermissions.update(
                    userPermission, { where: { id: existUserPermission.id } }
                )
                action = 2
            }

            
        } else {
            // Otherwise create new group
            if (UserPermission)
                next(createError.Conflict('The User permission specified already exists!'))

            userPermission = await UserPermissions.create(userPermission)
            aciton = 1
        }

        //const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(user_id, 5, action, true, userPermission.id)

        res.status(200).json({
            ...userPermission,
            message: "User permission details updated successfuly!",
        })
    } catch (err) {
        logData('editUserPermission: ' + err)
        next(err)
    }
}

const tenantDetails = async (req, res, next) => {
    try  {
        const tenantId = req.params.id;
        let tenantList = null;
        const { user_id, tenantId: tenant_id} =  req.jwtPayload;


        if (tenantId && tenantId >0) {
            // parameter is passed
            tenantList = await Tenants.findOne({
                where: { id: tenantId },
                attributes: {exclude: ['status_id', 'contact_id']},
                include: [{
                    model: Contacts,  as: 'Contact',
                    attributes: { exclude: ['contact_type', 'created_by', 'createdAt', 'updatedAt']}                  
                },
                {
                    model: TenantStatus, as: 'TenantStatus',
                    attributes: ['id', 'name']
                }
            ],
            })

        } else {
            // no parameter is passed
            tenantList = await Tenants.findAll({
                attributes: {exclude: ['status_id', 'contact_id']},
                include: [{
                    model: Contacts,  as: 'Contact',
                    attributes: { exclude: ['contact_type', 'created_by', 'createdAt', 'updatedAt']}                  
                },
                {
                    model: TenantStatus, as: 'TenantStatus',
                    attributes: ['id', 'name']
                }
            ],
            })
        }

        //const { user_id, tenatId} =  req.jwtPayload;

        await logUserActivity(user_id, 10, 4, true)

        res.status(200).json(
            tenantList
        )



    } catch (err) {
        logData('tenantDetails: ' + err)
        next(err)
    }
}

const licencePackageDetails = async (req, res, next) => {

    try {
        const packageId = req.params.id;
        //const { userId, tenantId} =  req.jwtPayload;
        let packageList = [];
          console.log('Here we go: ', packageId)

        if (packageId && packageId > 0) {
            // parameter is passed
            packageList = await LicensePackage.findOne({
                where: { id: packageId},
                include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ],
            include: [{
                model: Application, as : "Application",
                attributes: ["id", "name"]
            }]
            })

        } else {
            // no parameter is passed
          
            packageList = await LicensePackage.findAll({
                include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ],
            include: [{
                model: Application, as : "Application",
                attributes: ["id", "name"]
            }]
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

       // await logUserActivity(userId, 6, 4, true)

        res.status(200).json(
            packageList
        )

    } catch (err) {
        logData('getLicensePackage: ' + err)
        next(err)
    }
}

const editLicensePackage = async (req, res, next) => {
    try {

        let packages = await licensePackage.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;

    
        const LicensePackages = await LicensePackage.findOne({
            where: {  id: packages.id } 
        });
          const existLicensePackages = await LicensePackage.findOne({
            where: {  id: packages.id } 
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existLicensePackages) {
            // if ID is present then is for update
            if (packages.id > 0 && packages.id == existLicensePackages.id) {
                LicensePackage.update(
                    packages, { where: { id: existLicensePackages.id } }
                )
                action = 2
            }

            
        } else {
            // Otherwise create new group
            if (LicensePackages)
                next(createError.Conflict('The license package name already exists!'))
          packages =  await LicensePackage.create(packages)
          action = 1
        }


        await logUserActivity(userId, 6, action, true, packages.id)

        res.status(200).json({
            ...packages,
            message: "License package details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;

    } catch (err) {
        logData('createLicensePackage: +' + err)
        next(err)
    }
}

const paymentMethodDetails = async (req, res, next) => {

    try {
        const methodId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        let methodList = null;

        if (methodId && methodId >0) {
            // parameter is passed
            methodList = await LicensePaymentMethod.findOne({
                where: { id: methodId},
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]

         } )

        } else {
            // no parameter is passed
            methodList = await LicensePaymentMethod.findAll({
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

        await logUserActivity(userId, 7, 4, true)

        res.status(200).json(
            methodList
        )

    } catch (err) {
        logData('getPaymentMethod: ' + err)
        next(err)
    }
}

const editPaymentMethod = async (req, res, next) => {
    try {

        let method = await paymentMethod.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;

    
        const PayMethod = await LicensePaymentMethod.findOne({
            where:  { name: method.name } 
        });

        const existGroup = await LicensePaymentMethod.findOne({
            where: { id: group.id } 
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existGroup) {
            // if ID is present then is for update
            if (method.id  > 0 && method.id == existGroup.id) {
                LicensePaymentMethod.update(
                    method, { where: { id: existGroup.id } }
                )
                action = 2
            }

        } else {
            // Otherwise create new group
            if (PayMethod)
                next(createError.Conflict('The payment method already exists!'))

          method =  await LicensePaymentMethod.create(method)
          action = 1
        }


        await logUserActivity(userId, 2, action, true, group.id)

        res.status(200).json({
            ...method,
            message: "Payment method details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;

    } catch (err) {
        logData('createPaymentMethod: +' + err)
        next(err)
    }
}


const userCountDetails = async (req, res, next) => {

    try {
        const userCountId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        let userCountList = null;

        if (userCountId && userCountId >0) {
            // parameter is passed
            userCountList = await LicenseUserCount.findOne({
                where: { id: userCountId},
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]

         } )

        } else {
            // no parameter is passed
            userCountList = await LicensePaymentMethod.findAll({
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

        await logUserActivity(userId, 8, 4, true)

        res.status(200).json(
            userCountList
        )

    } catch (err) {
        logData('getLicenseUserCount: ' + err)
        next(err)
    }
}

const editUserCount = async (req, res, next) => {
    try {

        let userCount = await licenseCount.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;

    
        const UserCount = await LicenseUserCount.findOne({
            where:  { name: method.name } 
        });

        const existUserCount = await LicenseUserCount.findOne({
            where: { id: userCount.id } 
        });

        let action = 0;
        // Exist same group name in same tenant
        if (existUserCount) {
            // if ID is present then is for update
            if (userCount.id  > 0 && userCount.id == existUserCount.id) {
                LicenseUserCount.update(
                    userCount, { where: { id: existGrexistUserCountup.id } }
                )
                action = 2
            }

        } else {
            // Otherwise create new group
            if (UserCount)
                next(createError.Conflict('The license User Count details already exists!'))

          userCount =  await LicenseUserCount.create(userCount)
          action = 1
        }


        await logUserActivity(userId, 8, action, true, group.id)

        res.status(200).json({
            ...userCount,
            message: "License User Count details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;

    } catch (err) {
        logData('createUserCount: +' + err)
        next(err)
    }
}

const branchCountDetails = async (req, res, next) => {

    try {
        const branchCountId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        let branchCountList = null;

        if (branchCountId && branchCount >0) {
            // parameter is passed
            branchCountList = await LicenseBranchCount.findOne({
                where: { id: branchCountId},
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]

         } )

        } else {
            // no parameter is passed
            branchCountList = await LicenseBranchCount.findAll({
                 include: [{
                    model: Users, as: "CreatedBy",
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
            ]
            })
        }

       // const { userId, tenatId} =  req.jwtPayload;

        await logUserActivity(userId, 9, 4, true)

        res.status(200).json(
            branchCountList
        )

    } catch (err) {
        logData('getLicenseBranchCount: ' + err)
        next(err)
    }
}

const editBranchCount = async (req, res, next) => {
    try {

        let branchCount = await branchCount.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;

    
        const BranchCount = await LicenseBranchCount.findOne({
            where:  { name: method.name } 
        });

        const exisBranchCount = await LicenseBranchCount.findOne({
            where: { id: userCount.id } 
        });

        let action = 0;
        // Exist same group name in same tenant
        if (exisBranchCount) {
            // if ID is present then is for update
            if (userCount.id  > 0 && userCount.id == exisBranchCount.id) {
                LicenseBranchCount.update(
                    userCount, { where: { id: exisBranchCount.id } }
                )
                action = 2
            }

        } else {
            // Otherwise create new group
            if (BranchCount)
                next(createError.Conflict('The license Branch Count details already exists!'))

          branchCount =  await LicenseBranchCount.create(branchCount)
          action = 1
        }


        await logUserActivity(userId, 9, action, true, group.id)

        res.status(200).json({
            ...branchCount,
            message: "License Branch Count details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;

    } catch (err) {
        logData('createBranchCount: +' + err)
        next(err)
    }
}


module.exports = {
    groupDetails,
    editGroup,
    userDetails,
    editUser,
    userGroupDetails,
    editUserGroup,
    groupPermissionDetails,
    editGroupPermission,
    userPermissionDetails,
    editUserPermission,
    tenantDetails,
    licencePackageDetails,
    editLicensePackage,
    editPaymentMethod,
    paymentMethodDetails,
    userCountDetails,
    editUserCount,
    branchCountDetails,
    editBranchCount
}