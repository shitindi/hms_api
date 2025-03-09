const createError = require('http-errors');
const { groupSchema, userSchema, contactSchema, userGroupSchema, groupPermissionSchema, userPermissionSchema } = require('../helpers/auth_validation_schema')
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

const groupDetails = async (req, res, next) => {

    try {
        const groupId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        let groupList = null;

        if (groupId) {
            // parameter is passed
            groupList = await Groups.findOne({
                where: { id: groupId, tenant_id: tenantId },
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
                where: {tenant_id: tenantId},
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

        if (tenantId != group.tenant_id){
            throw createError.Forbidden('Tenant specified is not valid')
        }

        const Group = await Groups.findOne({
            where: { [Op.and]: { group_name: group.group_name, tenant_id: group.tenant_id } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (Group) {
            // if ID is present then is for update
            if (group.id && group.id > 0 && group.id == Group.id) {
                Groups.update(
                    group, { where: { id: group.id } }
                )
                action = 2
            }

            createError.Conflict('The group name already exists!')
        } else {
            // Otherwise create new group
          group =  await Groups.create(group)
          action = 1
        }



        res.status(200).json({
            ...group,
            message: "Group details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;
        await logUserActivity(userId, 2, action, true, group.id)

    } catch (err) {
        logData('createGroup: +' + err)
        next(err)
    }
}

const userGroupDetails = async (req, res, next) => {
    try {
        const userGroupId = req.params.id;
        const { userId, tenantId} =  req.jwtPayload;
        console.log('JWTPayload: ', req.jwtPayload)
        let userGroupList = null;

        if (userGroupId) {
            // parameter is passed
            userGroupList = await UserGroups.findOne({
                where: { id: userGroupId , tenant_id: tenantId},
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
                where: { tenant_id: tenantId},
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

        if (tenantId != userGroup.tenant_id){
            throw createError.Forbidden('Tenant specified is not valid')
        }


        const UserGroup = await UserGroups.findOne({
            where: { [Op.and]: { user_id: userGroup.user_id, group_id: userGroup.group_id, tenant_id: userGroup.tenant_id } }
        });

        let action = 0;
        // Exist same group name in same tenant
        if (UserGroup) {
            // if ID is present then is for update
            if (userGroup.id && userGroup.id > 0 && userGroup.id == UserGroup.id) {
                await UserGroups.update(
                    userGroup, { where: { id: userGroup.id } }
                )
                action =2
            }

            createError.Conflict('The User with specified group already exists!')
        } else {
            // Otherwise create new group
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

        if (userId) {
            userList = await Users.findOne({
                where: { id: userId , tenant_id: tenantId},
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
                where: {tenant_id: tenantId},
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

        if (tenantId != user.tenant_id){
            throw createError.Forbidden('Tenant specified is not valid')
        }


        const User = await Users.findOne({
            where: { user_name: user.user_name }
        });


        let action = 0;
        // Exist same user name in same tenant
        if (User) {
            // if ID is present then is for update
            if (user.user_id && user.user_id > 0 && user.id == User.id) {
                await User.update(
                    user, { where: { id: user.user_id } }
                );

                const Contact = await Contacts.findOne({
                    where: { id: user?.contact_id ?? 0 }
                })

                if (Contact && Contact.id == User.contact_id) {
                    await Contacts.update(
                        contact, { where: { id: User.contact_id },
                        fields: ['must_change_password', 'user_status']
                    }
                    )
                    if (User.user_status != user.user_status){
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

            createError.Conflict('The user name already exists!')
        } else {
            // Otherwise create new user and contact
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

        if (permissionId) {
            // parameter is passed
            permissionList = await GroupPermissions.findOne({
                where: { id: permissionId, tenant_id: tenantId },
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
                where: {tenant_id: tenantId},
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

        if (tenantId != groupPermission.tenant_id){
            throw createError.Forbidden('Tenant specified is not valid')
        }


        const GroupPermission = await GroupPermissions.findOne({
            where: { [Op.and]: { module_id:groupPermission.module_id, group_id: groupPermission.group_id,
                                 permission_type: groupPermission.permission_type } }
        });

        let action = 0
        // Exist same group name in same tenant
        if (GroupPermission) {
            // if ID is present then is for update
            if (groupPermission.id && groupPermission.id > 0 && groupPermission.id == GroupPermission.id) {
                await GroupPermissions.update(
                    groupPermission, { where: { id: GroupPermission.id } }
                )
                action = 2
            }

            createError.Conflict('The Group permission specified already exists!')
        } else {
            // Otherwise create new group
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

        if (permissionId) {
            // parameter is passed
            permissionList = await UserPermissions.findOne({
                where: { id: permissionId, tenant_id: tenantId },
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
                where: {tenant_id: tenantId},
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

        if (tenantId != userPermission.tenant_id){
            throw createError.Forbidden('Tenant specified is not valid')
        }

        const UserPermission = await UserPermissions.findOne({
            where: { [Op.and]: { user_id: userPermission.user_id, permission_type: userPermission.permission_type,
                 module_id: userPermission.module_id } }
        });

        let action = 0
        // Exist same group name in same tenant
        if (UserPermission) {
            // if ID is present then is for update
            if (userPermission.id && userPermission.id > 0 && userPermission.id == UserPermission.id) {
                await UserPermissions.update(
                    userPermission, { where: { id: UserPermission.id } }
                )
                action = 2
            }

            createError.Conflict('The User permission specified already exists!')
        } else {
            // Otherwise create new group
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


        if (tenantId) {
            // parameter is passed
            tenantList = await Tenants.findOne({
                where: { id: tenant_id },
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
                where: { id: tenant_id },
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

        await logUserActivity(user_id, 6, 4, true)

        res.status(200).json(
            tenantList
        )



    } catch (err) {
        logData('tenantDetails: ' + err)
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
    tenantDetails
}