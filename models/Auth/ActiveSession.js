const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')

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
   logout_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
   refresh_date: {
    type: DataTypes.DATE,
    allowNull: true
   },
   user_ip: {
    type: DataTypes.STRING(100),
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
     type: DataTypes.STRING(1000),
   },
   refresh_token: {
    type: DataTypes.STRING(1000)
   }
})

// Activation session
User.hasOne(ActiveSession, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ActiveSession.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { ActiveSession }

