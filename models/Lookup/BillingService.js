const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const BillingService = db.define('lookups_tbl_billing_service', {

    ID: {
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



  module.exports = { BillingService}