const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const BloodGroup = db.define('lookups_tbl_blood_group', {

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



  module.exports = { BloodGroup}