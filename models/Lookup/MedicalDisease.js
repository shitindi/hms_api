const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Disease = db.define('lookups_tbl_disease', {

    ID: {
        type: DataTypes.INTEGER,
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



  module.exports = { Disease}