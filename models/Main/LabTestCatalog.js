const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { LabTestCategory } = require('../Lookup/LabTestCategory')


const LabTestCatalog = db.define('main_tbl_lab_test_catalog', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    test_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    test_unit: {
        type: DataTypes.STRING
    },
    reference_range: {
        type: DataTypes.STRING
    },
    cost: {
        type: DataTypes.DECIMAL
    },
    category_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    }
}
)

LabTestCategory.hasMany(LabTestCatalog, {foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabTestCatalog.belongsTo(LabTestCategory, { as: 'Category', foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { LabTestCatalog}