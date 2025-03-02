const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const Tenant = db.define('auth_tbl_tenant', {
    
    tenant_name: {
       type: DataTypes.STRING(150),
       allowNull: false,
       unique: true
    },
    
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
    }
});



module.exports = {Tenant}