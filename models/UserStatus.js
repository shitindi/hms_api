const  {sequelize:db, DataTypes} = require('../helpers/sequelize_init')
const {logData} = require('../helpers/logger')

const UserStatus = db.define('UserStatus', {

    ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }
}
)

UserStatus.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl UserStatus: ' + err))

  module.exports = { UserStatus}