const {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')
const {User} = require('./User')
const SessionHistory = db.define('session_history', {
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   loggin_date: {
    type: DataTypes.DATE,
    allowNull: false
   },
   refresh_date: {
    type: DataTypes.DATE,
    allowNull: true
   },
   expired_date: {
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

User.hasMany(SessionHistory, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})
SessionHistory.belongsTo(User, {foreignKey: {name: user_id, allowNull: false}, onUpdate: 'CASCADE'})

SessionHistory.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl SessionHistory: ' + err))

  module.exports = { SessionHistory}

