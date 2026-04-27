const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Tenant } = require('../Auth/Tenant')
const { User } = require('../Auth/User')
const { MedicineForm } = require('../Lookup/Medicineform')


const Medicine = db.define('main_tbl_medicine', {

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
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
)

Tenant.hasMany(Medicine, {foreignKey: {name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Medicine.belongsTo(Tenant, {as: 'Tenant',foreignKey: {  name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

MedicineForm.hasMany(Medicine, {foreignKey: {name: 'form_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Medicine.belongsTo(MedicineForm, { as: 'Form', foreignKey: {name: 'form_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


User.hasMany(Medicine, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Medicine.belongsTo(User, { as: 'CreatedBy', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { Medicine}