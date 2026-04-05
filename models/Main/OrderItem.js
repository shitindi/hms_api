const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { User } = require('../Auth/User')
const {Product} = require('../sales/Product')
const { Order } = require('./Order')
const OrderItem = db.define('sales_tbl_order_item', {

    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }, 
    order_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    total_price: {
        type: DataTypes.DECIMAL(12,2),
        allowNull: false
    },
}
)


// This will link to service charged
// Product.hasMany(OrderItem, {foreignKey: {name: 'product_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
// OrderItem.belongsTo(Product, { as: 'Product', foreignKey: {name: 'product_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Order.hasMany(OrderItem, {as: 'OrderItem', foreignKey: {name: 'order_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
OrderItem.belongsTo(Order, { as: 'Order', foreignKey: {name: 'order_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { 
    OrderItem
}