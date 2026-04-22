const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { LabResultStatus } = require('../Lookup/LabResultStatus')
const { Appointment } = require('./Apointment')
const { LabTestCatalog } = require('./LabTestCatalog')


const LabRequest = db.define('main_tbl_lab_request', {


    appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    test_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    test_result: {
        type: DataTypes.STRING
    },
    result_status: {
        type: DataTypes.SMALLINT
    },
    request_notes:{
        type: DataTypes.TEXT
    },
    result_notes: {
        type: DataTypes.TEXT
    }
    ,
    request_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    result_date: {
       type:  DataTypes.DATE
    }
}
)

Appointment.hasMany(LabRequest, { as: 'LabReqests', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabRequest.belongsTo(Appointment, { as: 'Appointment', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LabTestCatalog.hasMany(LabRequest, {foreignKey: {name: 'result_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabRequest.belongsTo(LabTestCatalog, { as: 'TestCatalog', foreignKey: {name: 'result_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


LabResultStatus.hasMany(LabRequest, { as: 'LabReqests', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabRequest.belongsTo(LabResultStatus, { as: 'ResultStatus', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
  module.exports = { LabRequest}