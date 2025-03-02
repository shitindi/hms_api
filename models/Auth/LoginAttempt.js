const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const LoginAttempt = db.define('auth_tbl_login_attempt', {
   user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
     },
    
   login_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
   }, 
    /*
   attempt_date: {
    type: DataTypes.DATE,
    allowNull: false,
   },
   */
   is_success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
   },
   client_ip: {
    type: DataTypes.STRING(100),
    allowNull: false
   }
})


  module.exports = { LoginAttempt}



 