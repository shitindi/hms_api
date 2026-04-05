const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const PaymentStatus = db.define('sales_lkp_payment_status', {

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


  module.exports = { PaymentStatus}