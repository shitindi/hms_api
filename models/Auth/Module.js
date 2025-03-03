const { description } = require('@hapi/joi/lib/base')
const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const Module = db.define('auth_tbl_module', {
    module_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
   },
   description: {
      type: DataTypes.STRING(300),
      allowNull: false
   },
   is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
   }

})


  module.exports = {
    Module
  }