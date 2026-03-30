const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {TenantStatus} = require('../Auth/TenantStatus')
const {TenantRegion} = require('../Lookup/Regions')
const {TenantCountry} = require('../Lookup/Country')
const { TenantType } = require('./TenantType')

const Tenant = db.define('auth_tbl_tenant', {
    
    tenant_name: {
       type: DataTypes.STRING(150),
       allowNull: false,
       unique: true
    },
    tenant_email: {
        type: DataTypes.STRING(100),
    },
    website: {
        type: DataTypes.STRING(300),
    },
    tin_number: {
        type: DataTypes.STRING(20),
    },
    vrn_number: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    tax_group: {
        type: DataTypes.TINYINT,
    },
    Country_id: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    region_id: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    region_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    tenant_Address: {
        type: DataTypes.STRING(300),
    },
    tenant_mobile: {
        type: DataTypes.STRING(15),
    },
    tenant_phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    tenant_description: {
        type: DataTypes.STRING(500),
    },
    
    tenant_status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    },
    tenant_contact_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    tenant_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

});

// Tenant data



TenantStatus.hasMany(Tenant, {foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantStatus, { as: 'TenantStatus',  foreignKey: {name: 'status_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantCountry.hasMany(Tenant, {foreignKey: {name: 'Country_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantCountry, {as: 'Country', foreignKey: {name: 'Country_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantRegion.hasMany(Tenant, {foreignKey: {name: 'region_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantRegion, { as: 'Region', foreignKey: {name: 'region_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantType.hasMany(Tenant, {foreignKey: {name: 'tenant_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(TenantType, {as: 'TenantType',foreignKey: {  name: 'tenant_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {Tenant}