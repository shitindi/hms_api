const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Priority = db.define('lookups_tbl_priority', {

    ID: {
        type: DataTypes.SMALLINT,
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



  module.exports = { Priority}