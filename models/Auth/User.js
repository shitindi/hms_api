const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {logData} = require('../../helpers/logger')
const { Tenant } = require('./Tenant')

const User = db.define('user', {
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
      defaultValue: 5
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
   }
}
)
Tenant.hasMany(User, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})


User.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl User: ' + err))

  module.exports = { User}