
const { paymentType } = require('../../controllers/lookup.controller')
const { sequelize : db, DataTypes } = require( '../../helpers/sequelize_init')
const { Tenant } =require( '../Auth/Tenant')
const { User } = require('../Auth/User')
const { LicensePaymentType } = require('../Client/LIcensePyamentType')
const { BillingService } = require('../Lookup/BillingService')
const {Currrency} = require('../Lookup/Currency')
const { Billing } = require('./Billing')
const { Order } = require('./Order')
const { PaymentStatus } = require('./PaymentStatus')

const Payment = db.define('sales_tbl_payment', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(18,2),
        allowNull: false
    },
    currency_id: {
        type: DataTypes.SMALLINT,
        allowNull:false
    }
    ,
    bill_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    service_id: {
        type: DataTypes.SMALLINT
    },
    invoice_no: {
        type: DataTypes.STRING(30),
    },
    paid_at: {
        type: DataTypes.DATE
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    notes: {
       type: DataTypes.STRING 
    }

})

BillingService.hasMany(Payment, {foreignKey: {name: 'service_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(BillingService, { as: 'BillingService', foreignKey: {name: 'service_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Tenant.hasMany(Payment, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Tenant, { as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LicensePaymentType.hasMany(Payment, {foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(LicensePaymentType, { as: 'PaymentMethod', foreignKey: {name: 'payment_method', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Currrency.hasMany(Payment, {foreignKey: {name: 'currency_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Currrency, { as: 'Currency', foreignKey: {name: 'currency_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Billing.hasMany(Payment, {foreignKey: {name: 'bill_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(Billing, { as: 'Order', foreignKey: {name: 'bill_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


User.hasMany(Payment, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Payment.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {
    Payment
}