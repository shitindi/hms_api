const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

//Type of activation whether is phone, sms, or reset code
const ActivationType = db.define('auth_lkp_activation_type', {

    ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }

}
)



  module.exports = { ActivationType }