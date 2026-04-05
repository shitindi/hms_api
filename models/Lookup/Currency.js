const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Currrency = db.define('lookups_tbl_currency', {

    id: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    code: {
        type: DataTypes.STRING(3)
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}
)


  module.exports = { Currrency}