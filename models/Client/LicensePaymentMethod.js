
const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { User } = require('../Auth/User')

const LicensePaymentMethod = db.define('client_lkp_license_payment_method', {

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
    account_number: {
        type: DataTypes.STRING(20)
    },
      created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
   },

}
)


User.hasMany(LicensePaymentMethod, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePaymentMethod.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {
    LicensePaymentMethod
}