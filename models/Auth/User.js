const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Contact} = require('../Auth/Contact')
const {Tenant } = require('../Auth/Tenant')
const {UserStatus} = require('../Auth/UserStatus')

const User = db.define('auth_tbl_user', {
   user_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
   },
   password: {
    type: DataTypes.STRING(100),
    allowNull: false
   },
    must_change_password: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sms_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    ,
   is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
   },
   retry_count: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0
   },
   contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: true
   },
   activated_date: {
      type: DataTypes.DATE,
      allowNull: true
   },
   user_status: {
      type: DataTypes.TINYINT,
      defaultValue: 5,
      allowNull: false
   }
}
)

// User data
User.hasMany(Contact, {foreignKey: {name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Contact.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Contact.hasOne(User, {foreignKey: {name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION',  onUpdate: 'CASCADE'})
User.belongsTo(Contact, { as: 'Contact', foreignKey: {name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Tenant.hasMany(User, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
User.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

UserStatus.hasMany(User, {foreignKey: {name: 'user_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
User.belongsTo(UserStatus, { as : 'UserSatus', foreignKey: {name: 'user_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

  const createUserObject = (userObj, contactId, tenantId) =>{
   const user = {
   user_name: userObj.user_name,
   password: userObj.password,
   confirm_password: userObj.confirm_password,
   must_change_password: userObj.must_change_password,
   contact_id: contactId,
   tenant_id: tenantId,
   }
   return user
  }
  

  module.exports = { 
   User,
   createUserObject
}