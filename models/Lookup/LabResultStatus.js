const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const LabResultStatus = db.define('lookups_tbl_lab_result_status', {

    id: {
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


  module.exports = { LabResultStatus}