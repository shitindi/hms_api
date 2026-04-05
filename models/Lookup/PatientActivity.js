const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const PatientActivity = db.define('main_tbl_patient_activities', {

    ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}
)



  module.exports = { PatientActivity}