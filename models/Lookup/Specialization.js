const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Specialization = db.define('lookups_tbl_specialization', {

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



  module.exports = { Specialization}