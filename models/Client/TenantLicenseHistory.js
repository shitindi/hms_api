const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {Tenant} = require('../Auth/Tenant')
const {LicensePackage} = require('./LicensePackage')
const {LicenseUserCount} = require('./LIcenseUserCount')
const {LicenseBranchCount} = require('./LicenseBranchCount')
const {LicensePayment} = require('./LicensePayment')

const TenantLicenseHistory = db.define('client_tbl_license_history', {


    payment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

// Tenant license history data
Tenant.hasMany(TenantLicenseHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicenseHistory.belongsTo(Tenant, {as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePackage.hasMany(TenantLicenseHistory, {foreignKey: {name: 'package_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicenseHistory.belongsTo(LicensePackage, { as: 'Package', foreignKey: {name: 'package_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseUserCount.hasMany(TenantLicenseHistory, {foreignKey: {name: 'user_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicenseHistory.belongsTo(LicenseUserCount, { as: 'UserCount', foreignKey: {name: 'user_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseBranchCount.hasMany(TenantLicenseHistory, {foreignKey: {name: 'branch_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicenseHistory.belongsTo(LicenseBranchCount, { as: 'BranchCount', foreignKey: {name: 'branch_count_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePayment.hasMany(TenantLicenseHistory, {foreignKey: {name: 'payment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
TenantLicenseHistory.belongsTo(LicensePayment, { as: 'Payment', foreignKey: {name: 'payment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {
    TenantLicenseHistory
}