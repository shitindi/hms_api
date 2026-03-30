const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const TenantStatus = db.define('auth_lkp_tenant_status', {

    ID: {
        type: DataTypes.TINYINT,
        allowNull: false,
        primaryKey:true,
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}
)


  module.exports = { TenantStatus}