const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')


const PasswordHistory = db.define('auth_tbl_password_history', {
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   password: {
    type: DataTypes.STRING(100),
    allowNull: false
   },
   start_date: {
    type: DataTypes.DATE,
    allowNull: false
   },
   end_date: {
    type: DataTypes.DATE,
    allowNull: true
   },
   is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
   }
});

// Password history

User.hasMany(PasswordHistory, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PasswordHistory.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

  module.exports = { PasswordHistory}