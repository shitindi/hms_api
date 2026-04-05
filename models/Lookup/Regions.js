const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const TenantRegion = db.define('lkp_region', {

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

    region_code: {
        type: DataTypes.SMALLINT,
        allowNull: false
    }
}

)




module.exports = {
    TenantRegion
}
