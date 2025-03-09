const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Contact} = require('../Auth/Contact')
const {TenantStatus} = require('../Auth/TenantStatus')
const Tenant = db.define('auth_tbl_tenant', {
    
    tenant_name: {
       type: DataTypes.STRING(150),
       allowNull: false,
       unique: true
    },
    
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Tenant data
Contact.hasOne(Tenant, {foreignKey: {name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(Contact, {as: 'Contact',foreignKey: {  name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

//Tenant status details
TenantStatus.hasMany(Tenant, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatus, { as: 'TenantStatus',  foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

module.exports = {Tenant}