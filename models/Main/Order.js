const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { User } = require('../Auth/User')
const {Patient} = require('../Main/Patient')
const { OrderStatus } = require('../Lookup/OrderStatus')

const Order = db.define('main_tbl_order', {
   
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull:true
    },
    total_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_status: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }     

}
)


Tenant.hasMany(Order, {foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Order.belongsTo(Tenant, { as: 'Tenant', foreignKey: {name: 'tenant_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Patient.hasMany(Order, {foreignKey: {name: 'patient_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Order.belongsTo(Patient, { as: 'Patient', foreignKey: {name: 'patient_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasMany(Order, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Order.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

OrderStatus.hasMany(Order, {foreignKey: {name: 'order_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Order.belongsTo(OrderStatus, { as: 'OrderStatus', foreignKey: {name: 'order_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = { 
    Order
 }