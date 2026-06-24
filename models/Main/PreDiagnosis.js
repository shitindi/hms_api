
const { allow } = require('joi')
const { sequelize: db, DataTypes } = require('../../helpers/sequelize_init')
const { Appointment } = require('./Apointment')
const PreDiagnosis = db.define('main_tbl_prediagnosis', {
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    chief_complaint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
    },
    history_of_present_illness: {
        type: DataTypes.TEXT,
    },
    ros_notes: {
        type: DataTypes.TEXT,
    },
    past_medical_history_notes: {
        type: DataTypes.TEXT
    },
    family_history: {
        type: DataTypes.TEXT
    },
    social_history: {
        type: DataTypes.TEXT
    },
    general_examination: {
        type: DataTypes.TEXT
    },
    local_examination: {
        type: DataTypes.TEXT
    },
    systemic_examination: {
        type: DataTypes.TEXT
    }
}
)

Appointment.hasOne(PreDiagnosis, {  as: 'PreDiagnosis', foreignKey: { name: 'patient_id', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
PreDiagnosis.belongsTo(Appointment, { as: 'Appointment', foreignKey: { name: 'patient_id', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })

module.exports = { PreDiagnosis }

