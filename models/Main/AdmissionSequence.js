const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')


const AdmissionSequence = db.define('main_tbl_admission_sequence', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
            unique: true
    },

    sequence_no: {
        type: DataTypes.INTEGER,
        allowNull: false,
    
    }
}
)

Tenant.hasMany(AdmissionSequence, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
AdmissionSequence.belongsTo(Tenant, {as: 'Tenant',foreignKey: {  name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { AdmissionSequence}