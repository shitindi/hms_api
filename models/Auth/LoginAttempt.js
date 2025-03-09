const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')

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


// Login attempt
User.hasMany(LoginAttempt, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LoginAttempt.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { LoginAttempt}



 