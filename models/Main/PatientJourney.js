const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { PatientActivity } = require('../Lookup/PatientActivity')


const PatientJourney = db.define('main_tbl_patient_journey', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    activity_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    from_activity: {
        type: DataTypes.SMALLINT
    },
    require_billing: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}
)


Tenant.hasMany(PatientJourney, {foreignKey: {name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientJourney.belongsTo(Tenant, {as: 'Tenant',foreignKey: {  name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

PatientActivity.hasMany(PatientJourney, {foreignKey: {name: 'activity_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientJourney.belongsTo(PatientActivity, {as: 'ToActivity',foreignKey: {  name: 'activity_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

PatientActivity.hasMany(PatientJourney, {foreignKey: {name: 'from_activity', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PatientJourney.belongsTo(PatientActivity, {as: 'FromActivity',foreignKey: {  name: 'from_activity', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { PatientJourney}