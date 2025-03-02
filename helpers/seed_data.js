const {logData} = require('../helpers/logger')
const {ActivationCode} = require('../models/Auth/ActivationCode')
const {ActivationType} = require('../models/Auth/ActivationType')
const {ActiveSession} = require('../models/Auth/ActiveSession')
const {Contact} = require('..//models/Auth/Contact')
const {LoginAttempt} = require('../models/Auth/LoginAttempt')
const {PasswordHistory} = require('..//models/Auth/PasswordHistory')
const {SessionHistory} = require('../models/Auth/SessionHistory')
const {Tenant} = require('../models/Auth/Tenant')
const {TenantStatus} = require('../models/Auth/TenantStatus')
const {TenantStatusHistory} = require('../models/Auth/TenantStatusHistory')
const {User} = require('../models/Auth/User')
const {UserStatus} = require('../models/Auth/UserStatus')
const {UserStatusHistory} = require('../models/Auth/UserStatusHistory')
const {hashPassword} = require('./hash_data')

const seedAuthDatabase = async () => {
    try{

   
    const activationTypesCount = ActivationType.count()
    const tenantStatusCount = TenantStatus.count()
    const userStatusCount = UserStatus.count()
    const usersCount = User.count()


    if (activationTypesCount == 0)
    {
        ActivationType.bulkCreate([
            {id:1, name:'Email Activation'}, {id:2, name: 'SMS Activation'}, {id:3, name: 'OTP code'}, {id: 4, name:'Password reset'}
        ])
    }

    if (tenantStatusCount == 0 ){
        TenantStatus.bulkCreate([
            {id: 1, name: 'Active'}, {id: 2, name:'Suspended'}, {id: 3, name: 'Deleted'}
        ])
    }

    if (userStatusCount == 0){
        UserStatus.bulkCreate([
            {id:1, name:'Active'}, {id:2, name: 'Blocked by System'}, {id:3, name: 'Locked by user'}, {id:4, name: 'Deleted'}, {id:5, name: 'Not verified'}
        ])
    }

    if(usersCount == 0){
        const user = {user_name:'admim@mycompany.com', password:'', must_change_password: false,email_verified:true, sms_verified: true,
            is_active: true, retry_count: 5, user_status: 1
        }
        user.password = await hashPassword('Developer@123')

        await User.create(user)
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


User.hasMany(Contact, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
Contact.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})


// Tenant data
Tenant.hasMany(User, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})


// Activation code
ActivationCode.hasMany(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(ActivationCode, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

ActivationType.hasMany(ActivationCode, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})
ActivationCode.belongsTo(ActivationType, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})

// Activation session
User.hasOne(ActiveSession, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})
ActiveSession.belongsTo(User, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})


// Login attempt
User.hasMany(LoginAttempt, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})
LoginAttempt.belongsTo(User, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})


// Password history

User.hasMany(PasswordHistory, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
PasswordHistory.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

//Session history
User.hasMany(SessionHistory, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})
SessionHistory.belongsTo(User, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})

//Tenant details
TenantStatus.hasMany(Tenant, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatus, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})

// Tenants status history
TenantStatusHistory.hasMany(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatusHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

TenantStatus.hasMany(TenantStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(TenantStatus, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

UserStatus.hasMany(User, {foreignKey: {name: 'user_status', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(UserStatus, {foreignKey: {name: 'user_status', allowNull: false}, onUpdate: 'CASCADE'})

//User Status history
UserStatusHistory.hasMany(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(User, {UserStatusHistory: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

UserStatus.hasMany(UserStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
UserStatusHistory.belongsTo(UserStatus, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})



//Lookups
ActivationType.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl activation_type: ' + err))

  TenantStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Tenant_status: ' + err))

  UserStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl UserStatus: ' + err))
  

  User.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl User: ' + err))

  Contact.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Contact: ' + err))


  SessionHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl SessionHistory: ' + err))

  PasswordHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl password_history: ' + err))


  LoginAttempt.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl LoginAttempt: ' + err))

ActiveSession.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl ActiveSession: ' + err))

ActivationCode.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl activation_code: ' + err))


  Tenant.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl Tenant: ' + err))

  TenantStatusHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => console.log('Create tbl tenant_status_history: ' + err))


UserStatusHistory.sync({alter: true})
.then( data =>{})
.catch( err => console.log('Create tbl user_status_history: ' + err))

}catch(error){
    console.log('SeedDatabase: ' + error)
}

}

module.exports = {
    seedAuthDatabase,
    updateAuthDbSchema
}