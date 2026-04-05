const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant} = require('../Auth/Tenant')
const {LicensePackage} = require('./LicensePackage')
const {LicenseUserCount} = require('./LIcenseUserCount')
const {LicenseBranchCount} = require('./LicenseBranchCount')
const {LicensePayment} = require('./LicensePayment')

const TenantLicense = db.define('client_tbl_license', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    package_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_count_id: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    branch_count_id: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    license_duration_month: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 12
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }

}
)

// Tenant license data
Tenant.hasMany(TenantLicense, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicense.belongsTo(Tenant, {as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePackage.hasMany(TenantLicense, {foreignKey: {name: 'package_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicense.belongsTo(LicensePackage, { as: 'Package', foreignKey: {name: 'package_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseUserCount.hasMany(TenantLicense, {foreignKey: {name: 'user_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicense.belongsTo(LicenseUserCount, { as: 'UserCount', foreignKey: {name: 'user_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseBranchCount.hasMany(TenantLicense, {foreignKey: {name: 'branch_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicense.belongsTo(LicenseBranchCount, { as: 'BranchCount', foreignKey: {name: 'branch_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePayment.hasMany(TenantLicense, {foreignKey: {name: 'payment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicense.belongsTo(LicensePayment, { as: 'Payment', foreignKey: {name: 'payment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})





module.exports = {
    TenantLicense
}