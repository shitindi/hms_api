const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { User } = require('../Auth/User')

const LicenseBranchCount = db.define('client_tbl_license_branch_count', {
    ID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey:true,
    },
    description: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    branch_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
        created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
   },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}
)


User.hasMany(LicenseBranchCount, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LicenseBranchCount.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = {
    LicenseBranchCount
}