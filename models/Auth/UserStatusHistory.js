const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

//Type of activation whether is phone, sms, or reset code
const UserStatusHistory = db.define('auth_tbl_user_status_history', {

    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: false,
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }

}
)



  module.exports = { UserStatusHistory }