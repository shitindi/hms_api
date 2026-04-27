const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { PrescriptionStatus } = require('../Lookup/PrescriptionStatus')
const { Appointment } = require('./Apointment')
const { Medicine } = require('./Medicine')


const Prescription = db.define('main_tbl_prescription', {

 
    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    frequency: {
        type: DataTypes.STRING(100)
    },
    duration: {
        type: DataTypes.STRING(100)
    },
    quantity: {
        type: DataTypes.SMALLINT
    },
    instructions: {
        type: DataTypes.STRING
    },
    status_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    }

}
)


Appointment.hasMany(Prescription, {as: 'Prescription', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Prescription.belongsTo(Appointment, { as: 'Appointment', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


PrescriptionStatus.hasMany(Prescription, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Prescription.belongsTo(PrescriptionStatus, {as: 'Status',foreignKey: {  name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Medicine.hasMany(Prescription, {foreignKey: {name: 'medicine_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Prescription.belongsTo(Medicine, { as: 'Medicine', foreignKey: {name: 'medicine_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { Prescription}

