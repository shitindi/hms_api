const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { User } = require('../Auth/User')
const { Appointment } = require('./Apointment')

const PatientVital = db.define('main_tbl_patient_vital', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    }, 
    apointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date_taken: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    temperature: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    bp_systolic: {
        type: DataTypes.SMALLINT
    },
    bp_diastolic: {
        type: DataTypes.SMALLINT
    },
     pulse_rate: {
        type: DataTypes.SMALLINT
    },
    respiratory_rate: {
        type: DataTypes.SMALLINT
    },
    oxygen_saturation: {
        type: DataTypes.SMALLINT
    },
    weight_kg: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    height_cm: {
        type: DataTypes.SMALLINT
    },
    blood_glucose: {
        type: DataTypes.SMALLINT
    },
    notes: {
        type: DataTypes.STRING
    },
    created_by: {
        type: DataTypes.INTEGER
    }
}

)

Tenant.hasMany(PatientVital, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientVital.belongsTo(Tenant, {as: 'Tenant',foreignKey: {  name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Appointment.hasOne(PatientVital, {as: 'PatientVital',foreignKey: {name: 'apointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientVital.belongsTo(Appointment, {as: 'Appointment',foreignKey: {  name: 'apointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(PatientVital, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientVital.belongsTo(User, {as: 'CreatedBy',foreignKey: {  name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {PatientVital}