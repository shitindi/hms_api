const createError = require('http-errors');
const { groupSchema, userSchema, contactSchema, userGroupSchema, groupPermissionSchema } = require('../helpers/auth_validation_schema')
const { Group: Groups } = require('../models/Auth/Group');
const { User: Users } = require('../models/Auth/User')
const { Contact: Contacts } = require('../models/Auth/Contact');
const { UserStatus } = require('../models/Auth/UserStatus')
const { UserGroup: UserGroups } = require('../models/Auth/UserGroup')
const { GroupPermission, GroupPermission } = require('../models/Auth/GroupPermission')
const { PersmissionType: PermisionTypes, PersmissionType } = require('../models/Auth/PermisionType')
const { Module: Modules } = require('../models/Auth/Module')
const { logData } = require('../helpers/logger');
const { request } = require('express');

const groupDetails = async (req, res, next) => {

    try {
        const groupId = req.params.id;
        let groupList = null;

        if (groupId) {
            // parameter is passed
            groupList = await Groups.findAll({
                where: { id: groupId },
                include: [{
                    model: Users,
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
                    model: Users,
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                }],
            })
        }

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

        const group = groupSchema.validateAsync(req.body)

        const Group = await Groups.findOne({
            where: { [Op.and]: { group_name: group.group_name, tenant_id: group.tenant_id } }
        });

        // Exist same group name in same tenant
        if (Group) {
            // if ID is present then is for update
            if (group.id && group.id > 0 && group.id == Group.id) {
                Groups.update(
                    group, { where: { id: group.id } }
                )
            }

            createError.Conflict('The group name already exists!')
        } else {
            // Otherwise create new group
            await Groups.create(group)
        }



        res.status(200).json({
            ...group,
            message: "Group details updated successfuly!",
        })



    } catch (err) {
        logData('createGroup: +' + err)
        next(err)
    }
}

const userGroupDetails = async (req, res, next) => {
    try {
        const userGroupId = req.params.id;
        let userGroupList = null;

        if (userGroupId) {
            // parameter is passed
            userGroupList = await Groups.findAll({
                where: { id: userGroupId },
                include: [{
                    model: Users,
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: Groups
                    }
                    ]
                }],
            })

        } else {
            // no parameter is passed
            userGroupList = await Groups.findAll({
                where: { id: userGroupId },
                include: [{
                    model: Users,
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    },
                    {
                        model: Groups
                    }
                    ]
                }],
            })
        }

        res.status(200).json(
            userGroupList
        )
    } catch (err) {
        logData('userGroupDetails: ' + err)
    }
}

const editUserGroup = async (req, res, next) => {
    try {
        const userGroup = userGroupSchema.validateAsync(req.body)

        const UserGroup = await UserGroups.findOne({
            where: { [Op.and]: { user_id: userGroup.user_id, group_id: userGroup.group_id, tenant_id: userGroup.tenant_id } }
        });

        // Exist same group name in same tenant
        if (UserGroup) {
            // if ID is present then is for update
            if (userGroup.id && userGroup.id > 0 && userGroup.id == UserGroup.id) {
                UserGroups.update(
                    userGroup, { where: { id: userGroup.id } }
                )
            }

            createError.Conflict('The User with specified group already exists!')
        } else {
            // Otherwise create new group
            userGroup = await UserGroups.create(userGroup)
        }



        res.status(200).json({
            ...userGroup,
            message: "User Group details updated successfuly!",
        })
    } catch (err) {
        logData('editUserGroup: ' + err)
    }
}

const userDetails = async (req, res, next) => {
    try {
        const userId = req.params.id;
        let userList = null;

        if (userId) {
            userList = await Users.findAll({
                where: { id: userId },
                include: [{
                    model: Contacts
                },
                {
                    model: UserStatus
                }],

            })
        } else {
            userList = await Users.findAll({
                include: [{
                    model: Contacts
                },
                {
                    model: UserStatus
                }],

            })
        }

        res.status(200).json(userList)
    } catch (err) {
        logData('userDetails: ' + err)
        next(err)
    }
}

const editUser = async (req, res, next) => {
    try {

        const user = userSchema.validateAsync(req.body)
        const contact = contactSchema.validateAsync(req.body)

        const User = await Users.findOne({
            where: { user_name: user.user_name }
        });


        // Exist same user name in same tenant
        if (User) {
            // if ID is present then is for update
            if (user.id && user.id > 0 && user.id == User.id) {
                User.update(
                    user, { where: { id: user.id } }
                );

                const Contact = await Contacts.findOne({
                    where: { id: user?.contact_id ?? 0 }
                })

                if (Contact && Contact.id == User.contact_id) {
                    await Contacts.update(
                        contact, { where: { id: contact.id } }
                    )
                }
            }

            createError.Conflict('The user name already exists!')
        } else {
            // Otherwise create new user and contact
            const newContact = await Users.create(contact)
            user.contact_id = newContact.id
            user = await Users.create(user)
        }



        res.status(200).json({
            ...user,
            message: "User details updated successfuly!",
        })
    } catch (err) {
        logData('editUser: ' + err)
        next(err)
    }
}

const groupPermissionDetails = async (req, res, next) => {
    try {
        const permissionId = req.params.id;
        let permissionList = null;

        if (permissionId) {
            // parameter is passed
            permissionList = await GroupPermission.findAll({
                where: { id: permissionId },
                include: [{
                    model: Users,
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Modules
                },
                {
                    model: PersmissionType
                },
                {
                    model: Groups
                }
                ],
            })

        } else {
            // no parameter is passed
            permissionList = await GroupPermission.findAll({
                include: [{
                    model: Users,
                    attributes: ['id', 'user_name'],
                    include: [{
                        model: Contacts,
                        attributes: ['id', 'first_name', 'last_name']
                    }]
                },
                {
                    model: Modules
                },
                {
                    model: PersmissionType
                },
                {
                    model: Groups
                }
                ],
            })
        }

        res.status(200).json(
            permissionList
        )

    } catch (err) {
        logData('groupPermissionDetails: ' + err)
    }
}

const editGroupPermission = async (req, res, next) => {
    try {
        const groupPermission = groupPermissionSchema.validateAsync(req.body)

        const GroupPermission = await GroupPermission.findOne({
            where: { [Op.and]: { module_id:groupPermission.module_id, group_id: groupPermission.group_id, permission_type: groupPermission.permission_type } }
        });

        // Exist same group name in same tenant
        if (GroupPermission) {
            // if ID is present then is for update
            if (groupPermission.id && groupPermission.id > 0 && groupPermission.id == GroupPermission.id) {
                GroupPermission.update(
                    groupPermission, { where: { id: GroupPermission.id } }
                )
            }

            createError.Conflict('The Group permission specified already exists!')
        } else {
            // Otherwise create new group
            groupPermission = await GroupPermission.create(groupPermission)
        }



        res.status(200).json({
            ...groupPermission,
            message: "Group permission details updated successfuly!",
        })
    } catch (err) {
        logData('editGroupPermission: ' + err)
    }
}

const tenantDetails = async (req, res, next) => {
    try {



    } catch (err) {
        logData('tenantDetails: ' + err)
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
    editGroupPermission
}