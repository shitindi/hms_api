const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { Unit } = require('../Lookup/Unit')

const BilledConsumable = db.define('main_tbl_billed_consumable', {
    
  
    name: {
        type: DataTypes.STRING(),
        allowNull: false
    },
    unit: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    unit_price: {
        type: DataTypes.DECIMAL,
        defaultValue: 0
    }
    ,
     created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
     }
     
}
)


//Unit.hasMany(Billing, {as: 'Billing', foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
BilledConsumable.belongsTo(Unit, {as: 'Unit',foreignKey: {  name: 'unit', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {BilledConsumable}