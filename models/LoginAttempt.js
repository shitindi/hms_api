const {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')
const {User} = require('./User')

const LoginAttempt = db.define('login_attempt', {
   user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
     },
   name: {
    type: DataTypes.STRING(100),
    allowNull: false,
   },
   attempt_date: {
    type: DataTypes.DATE,
    allowNull: false,
   },
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

User.hasMany(LoginAttempt, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})
LoginAttempt.belongsTo(User, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})

LoginAttempt.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl LoginAttempt: ' + err))

  module.exports = { LoginAttempt}



 