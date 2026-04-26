const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')


const LabTestCatalog = db.define('main_tbl_medicine', {

    tenant_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    generic_name: {
        type: DataTypes.STRING
    },
    brand_name: {
        type: DataTypes.STRING
    },
    form_id: {
        type: DataTypes.SMALLINT,  //tablet, capsule, syrup, injection
    },
    strength: {
        type: DataTypes.STRING // e.g. 500mg, 250mg/5ml
    },
    unit: {
        type: DataTypes.STRING
    },
    manufacturer: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    price: {
        type: DataTypes.DECIMAL
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}
)

LabTestCategory.hasMany(LabTestCatalog, {foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabTestCatalog.belongsTo(LabTestCategory, { as: 'Category', foreignKey: {name: 'category_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { LabTestCatalog}