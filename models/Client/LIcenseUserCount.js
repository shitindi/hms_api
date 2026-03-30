const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { User } = require('../Auth/User')

const LicenseUserCount = db.define('client_tbl_license_user_count', {
    ID: {
        type: DataTypes.TINYINT,
        allowNull: false,
        primaryKey:true,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    user_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
   }
}
)

User.hasMany(LicenseUserCount, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicenseUserCount.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {
    LicenseUserCount
}