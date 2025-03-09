const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')
const {UserStatus} = require('../Auth/UserStatus')
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

//User Status history
User.hasMany(UserStatusHistory, {foreignKey: {name: 'user_id', allowNull: false},onDelete: 'NO ACTION',  onUpdate: 'CASCADE'})
UserStatusHistory.belongsTo(User, {UserStatusHistory: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

UserStatus.hasMany(UserStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
UserStatusHistory.belongsTo(UserStatus, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { UserStatusHistory }