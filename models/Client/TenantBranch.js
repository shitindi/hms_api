const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant} = require('../Auth/Tenant')
const {Contact} = require('../Auth/Contact')
const {TenantCountry} = require('./Countries')
const {TenantRegion} = require('./Regions')

const TenantBranch = db.define('client_tbl_tenant_branch', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    branch_name: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    country_id: {
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
    Address: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: true
    },
    contact_person: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_active:{
        type: DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}
)

// Tenand branch data

Tenant.hasMany(TenantBranch, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantBranch.belongsTo(Tenant, { as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantCountry.hasMany(TenantBranch, {foreignKey: {name: 'country_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantBranch.belongsTo(TenantCountry, {as: 'Country', foreignKey: {name: 'country_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

TenantRegion.hasMany(TenantBranch, {foreignKey: {name: 'region_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantBranch.belongsTo(TenantRegion, { as: 'Region', foreignKey: {name: 'region_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Contact.hasMany(TenantBranch, {foreignKey: {name: 'contact_person', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantBranch.belongsTo(Contact, {as: 'ContactPerson', foreignKey: {name: 'contact_person', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {
    TenantBranch
}