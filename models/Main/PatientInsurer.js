const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const {Insurer} = require('./Insurer')
const {Patient} = require('./Patient')

const PatientInsurer = db.define('main_tbl_patient_insurer', {
    
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    insurer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

}
)

Insurer.hasMany(PatientInsurer, {foreignKey: {name: 'insurer_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientInsurer.belongsTo(Insurer, {as: 'Insurer',foreignKey: {  name: 'insurer_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Patient.hasMany(PatientInsurer, {foreignKey: {name: 'patient_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientInsurer.belongsTo(Patient, {as: 'Patient',foreignKey: {  name: 'patient_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

module.exports = {PatientInsurer}
