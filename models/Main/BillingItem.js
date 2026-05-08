const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { BillingService } = require('../Lookup/BillingService')
const { Billing } = require('./Billing')
const { PaymentStatus } = require('./PaymentStatus')

const BillingItem = db.define('sales_tbl_billing_item', {
     bill_id: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     service_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
     },
     quantity: {
        type: DataTypes.DECIMAL,
        allowNull: false
     },
     total_price: {
        type: DataTypes.DECIMAL,
        allowNull: false
     },
     paid_amount: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
     },
     payment_status: {
        type: DataTypes.SMALLINT,
        allowNull: false
     }
}
)


Billing.hasMany(BillingItem, {as: 'BillingItems', foreignKey: {name: 'bill_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
BillingItem.belongsTo(Billing, {as: 'Billing',foreignKey: {  name: 'bill_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

BillingItem.belongsTo(BillingService, {as: 'BillingService',foreignKey: {  name: 'service_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

BillingItem.belongsTo(PaymentStatus, {as: 'PaymentStatus',foreignKey: {  name: 'payment_status', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {BillingItem}