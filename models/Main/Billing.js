const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { User } = require('../Auth/User')
const { Appointment } = require('./Apointment')
const { PaymentStatus } = require('./PaymentStatus')

const Billing = db.define('sales_tbl_billing', {
    
  
     appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: false
     },
     billing_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0
     },
     billing_status: {
        type: DataTypes.SMALLINT,
        allowNull: false
     },
     billing_date: {
        type: DataTypes.DATE,
        allowNull: false
     },
     created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
     }
     
}
)

Appointment.hasOne(Billing, {as: 'Billing', foreignKey: {name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Billing.belongsTo(Appointment, {as: 'Appointment',foreignKey: {  name: 'appointment_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Billing.belongsTo(PaymentStatus, {as: 'BillingStatus',foreignKey: {  name: 'billing_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(Billing, {as: 'Billing', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Billing.belongsTo(User, {as: 'CreatedBy',foreignKey: {  name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {Billing}