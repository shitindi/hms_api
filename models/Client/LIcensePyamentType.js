
const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const LicensePaymentType = db.define('client_lkp_license_payment_type', {

    ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },

}
)



module.exports = {
    LicensePaymentType
}