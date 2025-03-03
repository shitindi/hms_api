const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const UserPermission = db.define('auth_tbl_user_permission', {
    module_id: {
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

  module.exports = {
    UserPermission
  }