const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Insurer = db.define('main_tbl_insure', {
    
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    }

}
)

module.exports = { Insurer}