const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant } = require('../Auth/Tenant')
const {User} = require('../Auth/User')
const {Module} = require('../Auth/Module')
const {PersmissionType} = require('../Auth/PermisionType')

const UserPermission = db.define('auth_tbl_user_permission', {
    module_id: {
    type: DataTypes.INTEGER,
    allowNull: false
   },
   tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   permission_type: {
    type: DataTypes.TINYINT,
    allowNull: false
   },
   created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
   }

})

// User permision data
User.hasMany(UserPermission, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(UserPermission, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(User, { as: 'User', foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

PersmissionType.hasMany(UserPermission, {foreignKey: {name: 'permission_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(PersmissionType, { as : 'PermissionType', foreignKey: {name: 'permission_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Module.hasMany(UserPermission, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Tenant.hasMany(UserPermission, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Module.hasMany(UserPermission, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserPermission.belongsTo(Module, { as: 'Module', foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = {
    UserPermission
  }