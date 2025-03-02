const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const ActiveSession = db.define('auth_tbl_active_session', {
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
   },
   loggin_date: {
    type: DataTypes.DATE,
    allowNull: false
   },
   refresh_date: {
    type: DataTypes.DATE,
    allowNull: true
   },
   user_ip: {
    type: DataTypes.STRING(15),
    allowNull: false
   },
   is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
   },
   voluntary_logout: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true
   },
   user_token: {
     type: DataTypes.STRING(100),
   },
   refresh_token: {
    type: DataTypes.STRING(100)
   }
})



  module.exports = { ActiveSession }

