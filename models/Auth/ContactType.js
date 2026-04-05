const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

const ContactType = db.define('auth_lkp_contact_type', {

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



  module.exports = { ContactType}