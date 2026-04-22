const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const LabTestCategory = db.define('lookups_tbl_lab_test_category', {

    id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    code: {
        type: DataTypes.STRING(3)
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}
)


  module.exports = { LabTestCategory}