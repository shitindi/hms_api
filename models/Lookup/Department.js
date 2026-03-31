const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Department = db.define('lookups_tbl_department', {

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



  module.exports = { Department}