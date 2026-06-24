const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Disease } = require('../Lookup/MedicalDisease')
const { Appointment } = require('./Apointment')
const { PreDiagnosis } = require('./PreDiagnosis')


const PatientDiseaseHistory = db.define('main_tbl_patient_disease_history', {
    
    diagnosis_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    disease_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

}
)

PreDiagnosis.hasMany(PatientDiseaseHistory, { as: 'DiseaseHistory', foreignKey: {name: 'diagnosis_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientDiseaseHistory.belongsTo(PreDiagnosis, {as: 'PreDiagnosis',foreignKey: {  name: 'diagnosis_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Disease.hasMany(PatientDiseaseHistory, {foreignKey: {name: 'disease_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientDiseaseHistory.belongsTo(Disease, {as: 'Disease',foreignKey: {  name: 'disease_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = { PatientDiseaseHistory}