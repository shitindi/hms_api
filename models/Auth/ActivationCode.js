const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const ActivationCode = db.define('auth_tbl_activation_code', {

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activation_type: {          // 1 email, 2 sms, 3 otp code, 4 password reset by email
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
    },
    expire_at: {
        type: DataTypes.DATE,
        allowNull: false
    }

}
)


  module.exports = { ActivationCode}