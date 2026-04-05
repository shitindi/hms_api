const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const OrderStatus = db.define('lookup_tbl_order_status', {

    id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}
)


  module.exports = { OrderStatus}