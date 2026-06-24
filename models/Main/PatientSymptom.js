const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Symptom } = require('../Lookup/Symptoms')
const { Appointment } = require('./Apointment')
const { PreDiagnosis } = require('./PreDiagnosis')


const PatientSymptom = db.define('main_tbl_patient_symptom', {
    
    diagnosis_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    symptom_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

}
)

PreDiagnosis.hasMany(PatientSymptom, { as: 'PatientSymptoms', foreignKey: {name: 'diagnosis_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientSymptom.belongsTo(PreDiagnosis, {as: 'PreDiagnosis',foreignKey: {  name: 'diagnosis_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Symptom.hasMany(PatientSymptom, {foreignKey: {name: 'symptom_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientSymptom.belongsTo(Symptom, {as: 'Symtomps',foreignKey: {  name: 'symptom_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = { PatientSymptom}