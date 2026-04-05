const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const Insurer = db.define('main_tbl_insure', {
    
    name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    phone: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    }

}
)

module.exports = { Insurer}