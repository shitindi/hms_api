const  {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')
const { TenantStatus } = require('./TenantStatus')



const Tenant = db.define('tenant', {
    
    tenant_name: {
       type: DataTypes.STRING(150),
       allowNull: false,
       unique: true
    },
    
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
    }
});

TenantStatus.hasMany(Tenant, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatus, {foreignKey: {name: 'status_id', allowNull: false}, onUpdate: 'CASCADE'})





Tenant.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl Tenant: ' + err))

module.exports = {Tenant}