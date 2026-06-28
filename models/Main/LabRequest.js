const { sequelize: db, DataTypes } = require('../../helpers/sequelize_init')
const { LabRequestStatus } = require('../Lookup/LabRequestStatus')
const { LabResultStatus } = require('../Lookup/LabResultStatus')
const { Appointment } = require('./Apointment')
const { LabTestCatalog } = require('./LabTestCatalog')
const { PaymentStatus } = require('./PaymentStatus')


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
    request_status: {
        type: DataTypes.SMALLINT,
    },
    request_notes: {
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
        type: DataTypes.DATE
    },
    result_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    pyament_status: {
        type: DataTypes.SMALLINT,
        allowNull: false
    }
}
)

PaymentStatus.hasMany(LabRequest, { foreignKey: { name: 'pyament_status', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
LabRequest.belongsTo(PaymentStatus, { as: 'PaymentStatus', foreignKey: { name: 'pyament_status', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })



Appointment.hasMany(LabRequest, { as: 'LabReqests', foreignKey: { name: 'appointment_id', allowNull: false }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
LabRequest.belongsTo(Appointment, { as: 'Appointment', foreignKey: { name: 'appointment_id', allowNull: false }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })

LabTestCatalog.hasMany(LabRequest, { foreignKey: { name: 'test_id', allowNull: false }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
LabRequest.belongsTo(LabTestCatalog, { as: 'TestCatalog', foreignKey: { name: 'test_id', allowNull: false }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })


LabResultStatus.hasMany(LabRequest, { as: 'LabReqests', foreignKey: { name: 'result_status', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
LabRequest.belongsTo(LabResultStatus, { as: 'ResultStatus', foreignKey: { name: 'result_status', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })

LabRequest.belongsTo(LabRequestStatus, { as: 'RequestStatus', foreignKey: { name: 'request_status', allowNull: true }, onDelete: 'NO ACTION', onUpdate: 'CASCADE' })

module.exports = { LabRequest }


