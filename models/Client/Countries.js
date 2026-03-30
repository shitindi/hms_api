const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const TenantCountry= db.define('client_lkp_countries', {

    ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },

    zip_code: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        unique: true
    }
}

)



module.exports = {
    TenantCountry
}