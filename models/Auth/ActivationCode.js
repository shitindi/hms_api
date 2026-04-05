const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')
const {ActivationType} = require('../Auth/ActivationType')
const ActivationCode = db.define('auth_tbl_activation_code', {

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activation_type: {          // 1 email, 2 sms, 3 otp code, 4 password reset by email
        type: DataTypes.SMALLINT,
        allowNull: false
    },

    user_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    user_token: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    expire_at: {
        type: DataTypes.DATE,
        allowNull: false
    }

}
)


// Activation code
User.hasMany(ActivationCode, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ActivationCode.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

ActivationType.hasMany(ActivationCode, {foreignKey: {name: 'activation_type', allowNull: false},onDelete: 'NO ACTION',  onUpdate: 'CASCADE'})
ActivationCode.belongsTo(ActivationType, {foreignKey: {name: 'activation_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { ActivationCode}