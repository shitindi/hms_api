
const { sequelize : db, DataTypes } = require( '../../helpers/sequelize_init')
const { Tenant } =require( '../Auth/Tenant')
const { User } = require('../Auth/User')
const { LicensePaymentType } = require('../Client/LIcensePyamentType')
const {Currrency} = require('../sales/Currrency')
const {Order} = require('../sales/Order')
const { PaymentStatus } = require('./PaymentStatus')

const Payment = db.define('sales_tbl_payment', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    },
    currency_id: {
        type: DataTypes.TINYINT,
        allowNull:false
    }
    ,
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    invoice_no: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    paid_at: {
        type: DataTypes.DATE
    },
    payment_status: {
        type: DataTypes.TINYINT,
        allowNull:false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

})

Tenant.hasMany(Payment, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Tenant, { as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePaymentType.hasMany(Payment, {foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(LicensePaymentType, { as: 'PaymentMethod', foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Currrency.hasMany(Payment, {foreignKey: {name: 'currency_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Currrency, { as: 'Currency', foreignKey: {name: 'currency_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Order.hasMany(Payment, {foreignKey: {name: 'order_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Order, { as: 'Order', foreignKey: {name: 'order_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

PaymentStatus.hasMany(Payment, {foreignKey: {name: 'payment_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(PaymentStatus, { as: 'PaymentStatus', foreignKey: {name: 'payment_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(Payment, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {
    Payment
}