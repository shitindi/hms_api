const { description } = require('@hapi/joi/lib/base')
const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

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


  module.exports = {
    ModuleItem
  }