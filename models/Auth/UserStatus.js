const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const UserStatus = db.define('auth_lkp_user_status', {

    ID: {
        type: DataTypes.TINYINT,
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



  module.exports = { UserStatus}