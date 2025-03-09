const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant } = require('../Auth/Tenant')
const {User} = require('../Auth/User')

const Group = db.define('auth_tbl_group', {
    group_name: {
    type: DataTypes.STRING(100),
   },
   tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
   description: {
      type: DataTypes.STRING(300),
      allowNull: true
   },
   is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
   }

})

// Group data
User.hasMany(Group, { as:'CreatedBy' ,foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Group.belongsTo(User, {as:'CreatedBy' ,foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Tenant.hasMany(Group, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Group.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = {
   Group
  }