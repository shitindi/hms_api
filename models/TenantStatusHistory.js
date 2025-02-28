const  {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')
const { TenantStatus } = require('./Tenant')
const {Tenant} = require('./Tenant')


const TenantStatusHistory = db.define('tenant_status_history', {
    
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

TenantStatusHistory.hasMany(Tenant, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatusHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})

TenantStatus.hasMany(TenantStatusHistory, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
TenantStatusHistory.belongsTo(TenantStatus, {foreignKey: {name: 'tenant_id', allowNull: false}, onUpdate: 'CASCADE'})



Tenant.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl tenant_status_history: ' + err))

module.exports = {TenantStatusHistory}