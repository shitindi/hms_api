const  {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')

const TenantStatus = db.define('tenant_status', {

    ID: {
        type: DataTypes.TINYINT,
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



TenantStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl Tenant_status: ' + err))

  module.exports = { TenantStatus}