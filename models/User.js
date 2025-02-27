const {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')

const User = db.define('user', {
   user_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
   },
   password: {
    type: DataTypes.STRING(100),
    allowNull: false
   },
    must_change_password: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sms_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    ,
   is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
   },
   retry_count: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 5
   },
   contact_id: {
      type: DataTypes.INTEGER,
      allowNull: false
   }
}
)


User.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl User: ' + err))

  module.exports = { User}