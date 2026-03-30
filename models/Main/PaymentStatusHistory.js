const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { User } = require('../Auth/User')
const { PaymentStatus } = require('./PaymentStatus')


const PaymentStatusHistory = db.define('sales_lkp_payment_status_history', {

    
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    status_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull:false
    }
}
)

Tenant.hasMany(PaymentStatusHistory, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PaymentStatusHistory.belongsTo(Tenant, { as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

PaymentStatus.hasMany(PaymentStatusHistory, {foreignKey: {name: 'status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PaymentStatusHistory.belongsTo(PaymentStatus, { as: 'Status', foreignKey: {name: 'status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(PaymentStatusHistory, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
PaymentStatusHistory.belongsTo(User, { as: 'User', foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { 
    PaymentStatusHistory
}