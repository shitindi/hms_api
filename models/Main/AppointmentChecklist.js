const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Appointment } = require('./Apointment')

const AppointmentChecklist = db.define('main_tbl_apointment_checklist',
    {
        appointment_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        consultation_is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        pre_diagnosis_done: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        is_lab_requested: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        patient_prescibed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        history_reviewed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    }
)

Appointment.hasOne(AppointmentChecklist,  {as: 'AppointmentChecklist', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
AppointmentChecklist.belongsTo(Appointment, {as: 'Appointment',foreignKey: {  name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {AppointmentChecklist}