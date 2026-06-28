const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { BilledConsumable } = require('./BilledConsumable')
const { LabRequest } = require('./LabRequest')


const LabTestConsumable = db.define('main_tbl_lab_test_consumable', {

   
    test_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}
)

LabRequest.hasMany(LabTestConsumable, {as: 'TestConsumable', foreignKey: {name: 'test_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
LabTestConsumable.belongsTo(LabRequest, {as: 'LabRequest',foreignKey: {  name: 'test_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

LabTestConsumable.belongsTo(BilledConsumable, {as: 'Consumable',foreignKey: {  name: 'item_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



  module.exports = { LabTestConsumable}