
const { sequelize : db, DataTypes } = require( '../../helpers/sequelize_init')
const { Tenant } =require( '../Auth/Tenant')
const { LicensePaymentMethod }= require('./LicensePaymentMethod')
const { LicensePaymentType } = require('./LIcensePyamentType')
const { LicenseUserCount } = require('./LIcenseUserCount')
const { LicenseBranchCount } = require('./LicenseBranchCount')

const LicensePayment= db.define('client_lkp_license_payment', {

    tenant_id: {
        type: DataTypes.INTEGER
    },
    payment_type: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    additional_user: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    additional_branch: {
        type: DataTypes.SMALLINT,
        allowNull: true
    }
}
)

Tenant.hasMany(LicensePayment, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePayment.belongsTo(Tenant, {as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePaymentType.hasMany(LicensePayment, {foreignKey: {name: 'payment_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePayment.belongsTo(LicensePaymentType, {as: 'PyamentType', foreignKey: {name: 'payment_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePaymentMethod.hasMany(LicensePayment, {foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePayment.belongsTo(LicensePaymentMethod, {as: 'PaymentMethod', foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseUserCount.hasMany(LicensePayment, {foreignKey: {name: 'additional_user', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePayment.belongsTo(LicenseUserCount, {as: 'UserCount', foreignKey: {name: 'additional_user', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicenseBranchCount.hasMany(LicensePayment, {foreignKey: {name: 'additional_branch', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePayment.belongsTo(LicenseBranchCount, {as: 'BranchCount', foreignKey: {name: 'additional_branch', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {
    LicensePayment
} 
    
