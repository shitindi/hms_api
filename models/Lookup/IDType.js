const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const IDType = db.define('lookups_tbl_id_type', {

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



  module.exports = { IDType}