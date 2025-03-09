const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Module} = require('../Auth/Module')

const ModuleItem = db.define('auth_tbl_module_item', {
    item_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
   },
   module_id: {
    type: DataTypes.INTEGER,
    allowNull: false
   },
   code: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      unique: true
   },

})


// Module Item data
Module.hasMany(ModuleItem, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ModuleItem.belongsTo(Module, {foreignKey: {name: 'module_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

  module.exports = {
    ModuleItem
  }