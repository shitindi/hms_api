const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const DefaultRole
 = db.define('lookups_tbl_default_roles', {

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
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}
)



  module.exports = { DefaultRole}