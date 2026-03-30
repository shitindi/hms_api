const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant } = require('../Auth/Tenant')
const {TenantStatus} = require('../Auth/TenantStatus')

const TenantStatusHistory = db.define('auth_tbl_tenant_status_history', {
    
    tenant_id: {
       type: DataTypes.INTEGER,
       allowNull: false,
    },
    
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING(300),
        allowNull: true
    }
});

// Tenants status history
Tenant.hasMany(TenantStatusHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantStatus.hasMany(TenantStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(TenantStatus, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})




module.exports = {TenantStatusHistory}