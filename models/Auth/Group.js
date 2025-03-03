const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


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

  module.exports = {
   Group
  }