const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {User} = require('../Auth/User')
const {ModuleItem} = require('../Auth/ModuleItem')
const {ActivityType} = require('../Auth/ActivityType')

const ActivityLog = db.define('auth_tbl_user_activity', {
   user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
   },
   module_item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
   },
   activity_type: {
    type: DataTypes.SMALLINT,
    allowNull: false
   },
   record_id: {
    type: DataTypes.INTEGER,
    allowNull: true
   },
   event_date: {
    type: DataTypes.DATE,
    allowNull: false
   },
   is_success: {
    type: DataTypes.BOOLEAN,
    allowNull: false
   }
})

// Activity logs data
User.hasMany(ActivityLog, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ActivityLog.belongsTo(User, {foreignKey: {name: 'user_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

ModuleItem.hasMany(ActivityLog, {foreignKey: {name: 'module_item_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ActivityLog.belongsTo(ModuleItem, {foreignKey: {name: 'module_item_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

ActivityType.hasMany(ActivityLog, {foreignKey: {name: 'activity_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
ActivityLog.belongsTo(ActivityType, {foreignKey: {name: 'activity_type', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {
    ActivityLog
}