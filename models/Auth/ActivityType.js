const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const ActivityType = db.define('auth_lkp_activity_type', {

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



  module.exports = { ActivityType}