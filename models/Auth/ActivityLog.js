const {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')

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
    type: DataTypes.TINYINT,
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


module.exports = {
    ActivityLog
}