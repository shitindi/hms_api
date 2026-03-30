const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const TenantType = db.define('auth_lkp_tenant_type', {

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

  module.exports = {
    TenantType
  }