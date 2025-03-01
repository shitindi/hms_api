const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {logData} = require('../../helpers/logger')
const {User} = require('./User')
const {ActivationType} = require('./ActivationType')

const ActivationCode = db.define('activation_code', {

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activation_type: {          // 1 email, 2 sms, 3 otp code
        type: DataTypes.INTEGER,
        allowNull: false
    },

    user_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_token: {
        type: DataTypes.STRING(300),
        allowNull: true
    }

}
)

ActivationCode.hasMany(User, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(ActivationCode, {foreignKey: {name: 'user_id', allowNull: false}, onUpdate: 'CASCADE'})

ActivationType.hasMany(ActivationCode, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})
ActivationCode.belongsTo(ActivationType, {foreignKey: {name: 'activation_type', allowNull: false}, onUpdate: 'CASCADE'})


ActivationCode.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl activation_code: ' + err))

  module.exports = { ActivationCode}