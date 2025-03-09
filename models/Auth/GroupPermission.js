const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant } = require('../Auth/Tenant')
const {User} = require('../Auth/User')
const {Group} = require('../Auth/Group')
const {Module} = require('../Auth/Module')
const {PersmissionType} = require('../Auth/PermisionType')

const GroupPermission = db.define('auth_tbl_group_permission', {
    module_id: {
    type: DataTypes.INTEGER,
    allowNull: false
   },
   tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   }, 
   group_id: {
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

// Group permission data
User.hasMany(GroupPermission, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
GroupPermission.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Group.hasMany(GroupPermission, {foreignKey: {name: 'group_id', allowNull: false},onDelete: 'NO ACTION',  onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Group, { as: 'Group', foreignKey: {name: 'group_id', allowNull: false},onDelete: 'NO ACTION',  onUpdate: 'CASCADE'})

PersmissionType.hasMany(GroupPermission, {foreignKey: {name: 'permission_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
GroupPermission.belongsTo(PersmissionType, { as: 'PermissionType', foreignKey: {name: 'permission_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Module.hasMany(GroupPermission, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Module, { as: 'Module', foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Tenant.hasMany(GroupPermission, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
GroupPermission.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = {
    GroupPermission
  }