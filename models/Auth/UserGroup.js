const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

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

  module.exports = {
    UserGroup
  }