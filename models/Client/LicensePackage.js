const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { User } = require('../Auth/User')
//const {Application} = require('./Apps')

const LicensePackage = db.define('client_tbl_license_packages', {


    package_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    user_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    branch_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    app_id: {
        type: DataTypes.SMALLINT,
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }

}
)

// License packages data
User.hasMany(LicensePackage, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicensePackage.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'} )

module.exports = {
    LicensePackage
}