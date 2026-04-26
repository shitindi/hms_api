const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const {AppointmentStatus} = require('../Lookup/AppointmentStatus')
const {AppointmentType} = require('../Lookup/AppointmentType')
const {Doctor} = require('./Doctor')
const {Priority} = require('../Lookup/Priority')
const { Patient } = require('./Patient')
const { User } = require('../Auth/User')
const { Department } = require('../Lookup/Department')
const { PatientActivity } = require('../Lookup/PatientActivity')

const Appointment = db.define('main_tbl_apointment', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    }, 
    patient_id: {
        type: DataTypes.INTEGER,
    },
    visit_type: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    department_id: {
        type: DataTypes.SMALLINT
    },
    doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    appointment_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    priority: {
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    appointment_reason: {
        type: DataTypes.STRING,
    },
    appointment_status:{
        type: DataTypes.SMALLINT,
        allowNull: false,
    },
    notification_notes: {
        type: DataTypes.STRING
    },
    sms_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email_notification: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    appointment_no: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    current_activity: {
        type: DataTypes.SMALLINT,
        defaultValue: 13
    },
    payment_done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}
)
PatientActivity.hasMany(Appointment, {foreignKey: {name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(PatientActivity, {as: 'PatientActivity',foreignKey: {  name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Department.hasMany(Appointment, {foreignKey: {name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(Department, {as: 'Department',foreignKey: {  name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


User.hasMany(Appointment, {foreignKey: {name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(User, {as: 'CreatedBy',foreignKey: {  name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


AppointmentType.hasMany(Appointment, {foreignKey: {name: 'visit_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(AppointmentType, {as: 'AppointmentType',foreignKey: {  name: 'visit_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Priority.hasMany(Appointment, {foreignKey: {name: 'priority', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(Priority, {as: 'Priority',foreignKey: {  name: 'priority', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


AppointmentStatus.hasMany(Appointment, {foreignKey: {name: 'appointment_status', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(AppointmentStatus, {as: 'AppointmentStatus',foreignKey: {  name: 'appointment_status', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Doctor.hasMany(Appointment, {foreignKey: {name: 'doctor_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(Doctor, {as: 'Doctor',foreignKey: {  name: 'doctor_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Patient.hasMany(Appointment, {as: 'Appointments', foreignKey: {name: 'patient_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Appointment.belongsTo(Patient, {as: 'Patient',foreignKey: {  name: 'patient_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})





module.exports = {Appointment}