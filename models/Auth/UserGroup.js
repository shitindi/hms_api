const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant } = require('../Auth/Tenant')
const {User} = require('../Auth/User')
const {Group} = require('../Auth/Group')
const UserGroup = db.define('auth_tbl_user_group', {
   tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
    user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
   },
   group_id: {
      type: DataTypes.INTEGER,
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

// UserGroup data
Tenant.hasMany(UserGroup, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserGroup.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(UserGroup, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserGroup.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(UserGroup, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserGroup.belongsTo(User, {as: 'User', foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Group.hasMany(UserGroup, {foreignKey: {name: 'group_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserGroup.belongsTo(Group, { as: 'Group', foreignKey: {name: 'group_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

  module.exports = {
    UserGroup
  }