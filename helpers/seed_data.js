const {logData} = require('../helpers/logger')
const {ActivationCode} = require('../models/Auth/ActivationCode')
const {ActivationType} = require('../models/Auth/ActivationType')
const {ActiveSession} = require('../models/Auth/ActiveSession')
const {Contact} = require('../models/Auth/Contact')
const {LoginAttempt} = require('../models/Auth/LoginAttempt')
const {PasswordHistory} = require('..//models/Auth/PasswordHistory')
const {SessionHistory} = require('../models/Auth/SessionHistory')
const {Tenant} = require('../models/Auth/Tenant')
const {TenantStatus} = require('../models/Auth/TenantStatus')
const {TenantStatusHistory} = require('../models/Auth/TenantStatusHistory')
const {User} = require('../models/Auth/User')
const {UserStatus} = require('../models/Auth/UserStatus')
const {UserStatusHistory} = require('../models/Auth/UserStatusHistory')

const {PersmissionType} = require('../models/Auth/PermisionType')
const {Group} = require('../models/Auth/Group')
const {UserGroup} = require('../models/Auth/UserGroup')
const {GroupPermission} = require('../models/Auth/GroupPermission')
const {Module} = require('../models/Auth/Module')
const {ModuleItem} = require('../models/Auth/ModuleItem')
const {UserPermission} = require('../models/Auth/UserPermission')

const {ActivityLog} = require('../models/Auth/ActivityLog')
const {ActivityType} = require('../models/Auth/ActivityType')

const {hashPassword} = require('./hash_data')


const seedAuthDatabase = async () => {
    try{

   
    const activationTypesCount = await ActivationType.count()
    const tenantStatusCount = await TenantStatus.count()
    const userStatusCount = await UserStatus.count()
    const usersCount = await User.count()
    const permissionTypCount = await PersmissionType.count()
    const activityTypeCount = await ActivityType.count()
    const moduleCount = await Module.count()

    console.log('activationCount: ' + activationTypesCount, ', tenantCount: ', tenantStatusCount, ', userStatuscount: ', userStatusCount, ', usersCount: ', usersCount)

    if (moduleCount==0){
       const module = await Module.create({
            id: 1,
          module_name: 'User management',
           code: 1001,
           description: 'User, roles and permission managements',
           is_active: true
       })

       if (module && module.id > 0){
        ModuleItem.bulkCreate([
            {id: 1, item_name: 'Users' , module_id: module.id , code: 101},
            {id: 2, item_name: 'Groups' , module_id: module.id , code: 102},
            {id: 3, item_name: 'User Group' , module_id: module.id , code: 103},
            {id: 4, item_name: 'Group Permission' , module_id: module.id , code: 104},
            {id: 5, item_name: 'User Permission' , module_id: module.id , code: 105 }
        ])
       }
    }

    if (activityTypeCount == 0){
       await ActivityType.bulkCreate([
            {id: 1,name: 'Create'}, {id: 2, name: 'Modify'}, {id: 3, name: 'Delete'}, {id: 4, name : 'View'}
        ])
    }

    if (activationTypesCount == 0)
    {
        await ActivationType.bulkCreate([
            {id:1, name:'Email Activation'}, {id:2, name: 'SMS Activation'}, {id:3, name: 'OTP code'}, {id: 4, name:'Password reset'}
        ])
    }

    if (tenantStatusCount == 0 ){
        await TenantStatus.bulkCreate([
            {id: 1, name: 'Active'}, {id: 2, name:'Suspended'}, {id: 3, name: 'Deleted'}
        ])
    }

    if (userStatusCount == 0){
       
        await UserStatus.bulkCreate([
            {id:1, name:'Active'}, {id:2, name: 'Blocked by System'}, {id:3, name: 'Locked by user'}, {id:4, name: 'Deleted'}, {id:5, name: 'Not verified'}
        ])
    }

    if(usersCount == 0){
        /*
        const  cont = await Contact.create(
            {    first_name: 'Ndinao',middle_name: 'Andrew', last_name: 'Shitindi',email: 'ndinao@hotmail.com', 
                mobile_no: '0715432268',  phone: '0779786152', position: 'Senior Software Developer',address: 'Buyuni chanika' }
        )

        const tenant = await Tenant.create(
            { tenant_name: 'Byteware inc',status_id: 1,contact_id: cont.id}
        )
        */
        const user = {user_name:'admim@mycompany.com', password:'', must_change_password: false,email_verified:true, sms_verified: true,
            is_active: true, retry_count: 0, user_status: 1, contact_id: 1, tenant_id: 1
        }
        user.password = await hashPassword('Developer@123')

        await User.create(user)
    }
    if (permissionTypCount == 0){
        await PersmissionType.bulkCreate([
            {id:1, name:'Read only'}, {id:2, name: 'Ready and write'}, {id: 3, name: 'No Access'}
        ])
    }

    }catch(error){
    console.log('SeedDatabase: ' + error)
}
}

const updateAuthDbSchema = async () => {

    try{
// User data
Contact.hasOne(User, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(Contact, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})

User.hasMany(Contact, {foreignKey: {name: 'created_by', allowNull: true}, onUpdate: 'CASCADE'})
Contact.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: true}, onUpdate: 'CASCADE'})


// Tenant data
Tenant.hasMany(User, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

Contact.hasOne(Tenant, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(Contact, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})


// Activation code
User.hasMany(ActivationCode, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
ActivationCode.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

ActivationType.hasMany(ActivationCode, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})
ActivationCode.belongsTo(ActivationType, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})

// Activation session
User.hasOne(ActiveSession, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
ActiveSession.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})


// Login attempt
User.hasMany(LoginAttempt, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
LoginAttempt.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})


// Password history

User.hasMany(PasswordHistory, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
PasswordHistory.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

//Session history
User.hasMany(SessionHistory, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
SessionHistory.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

//Tenant details
TenantStatus.hasMany(Tenant, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatus, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})

// Tenants status history
Tenant.hasMany(TenantStatusHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

TenantStatus.hasMany(TenantStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(TenantStatus, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

UserStatus.hasMany(User, {foreignKey: {name: 'user_status', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(UserStatus, {foreignKey: {name: 'user_status', allowNull: false}, onUpdate: 'CASCADE'})

//User Status history
User.hasMany(UserStatusHistory, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
UserStatusHistory.belongsTo(User, {UserStatusHistory: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

UserStatus.hasMany(UserStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
UserStatusHistory.belongsTo(UserStatus, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})

// Group data
User.hasMany(Group, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
Group.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})

Tenant.hasMany(Group, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
Group.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})


// UserGroup data
Tenant.hasMany(UserGroup, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
UserGroup.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

User.hasMany(UserGroup, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
UserGroup.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})

User.hasMany(UserGroup, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
UserGroup.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

Group.hasMany(UserGroup, {foreignKey: {name: 'group_id', allowNull: false}, onUpdate: 'CASCADE'})
UserGroup.belongsTo(Group, {foreignKey: {name: 'group_id', allowNull: false}, onUpdate: 'CASCADE'})


// Group permission data
User.hasMany(GroupPermission, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
GroupPermission.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})

Group.hasMany(GroupPermission, {foreignKey: {name: 'group_id', allowNull: false}, onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Group, {foreignKey: {name: 'group_id', allowNull: false}, onUpdate: 'CASCADE'})

PersmissionType.hasMany(GroupPermission, {foreignKey: {name: 'permission_type', allowNull: false}, onUpdate: 'CASCADE'})
GroupPermission.belongsTo(PersmissionType, {foreignKey: {name: 'permission_type', allowNull: false}, onUpdate: 'CASCADE'})

Module.hasMany(GroupPermission, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})

Tenant.hasMany(GroupPermission, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

// User permision data
User.hasMany(UserPermission, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})

User.hasMany(UserPermission, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

PersmissionType.hasMany(UserPermission, {foreignKey: {name: 'permission_type', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(PersmissionType, {foreignKey: {name: 'permission_type', allowNull: false}, onUpdate: 'CASCADE'})

Module.hasMany(UserPermission, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})

Tenant.hasMany(UserPermission, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

Module.hasMany(UserPermission, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})
UserPermission.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})


// Activity logs data
User.hasMany(ActivityLog, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
ActivityLog.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

ModuleItem.hasMany(ActivityLog, {foreignKey: {name: 'module_item_id', allowNull: false}, onUpdate: 'CASCADE'})
ActivityLog.belongsTo(ModuleItem, {foreignKey: {name: 'module_item_id', allowNull: false}, onUpdate: 'CASCADE'})

ActivityType.hasMany(ActivityLog, {foreignKey: {name: 'activity_type', allowNull: false}, onUpdate: 'CASCADE'})
ActivityLog.belongsTo(ActivityType, {foreignKey: {name: 'activity_type', allowNull: false}, onUpdate: 'CASCADE'})

// Module Item data
Module.hasMany(ModuleItem, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})
ModuleItem.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onUpdate: 'CASCADE'})

//Lookups
 await ActivationType.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl activation_type: ' + err))

  await TenantStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Tenant_status: ' + err))

  await UserStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl UserStatus: ' + err))

  await PersmissionType.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_permision_type: ' + err))

  await ActivityType.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_activity_type: ' + err))

  await ActivationCode.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl activation_code: ' + err))





  await Tenant.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Tenant: ' + err))

  await TenantStatusHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl tenant_status_history: ' + err))


  await User.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl User: ' + err))

  await Contact.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Contact: ' + err))


  await SessionHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl SessionHistory: ' + err))

  await PasswordHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl password_history: ' + err))


  await LoginAttempt.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl LoginAttempt: ' + err))

 await ActiveSession.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl ActiveSession: ' + err))

await UserStatusHistory.sync({alter: true})
.then( data =>{})
.catch( err => console.log('Create tbl user_status_history: ' + err))

await Group.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_group: ' + err))

 await UserGroup.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_user_group: ' + err))

// module data
await Module.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_module: ' + err))

  await GroupPermission.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_group_permission: ' + err))

  await UserPermission.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_user_permission: ' + err))

  await ActivityLog.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_activity_log: ' + err))

  await ModuleItem.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl auth_tbl_module_item ' + err))

}catch(error){
    console.log('updateDatabse: ' + error)
}

}

module.exports = {
    seedAuthDatabase,
    updateAuthDbSchema
}