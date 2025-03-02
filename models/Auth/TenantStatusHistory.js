const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const TenantStatusHistory = db.define('auth_tbl_tenant_status_history', {
    
    tenant_id: {
       type: DataTypes.INTEGER,
       allowNull: false,
    },
    
    status_id: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING(300),
        allowNull: true
    }
});



module.exports = {TenantStatusHistory}