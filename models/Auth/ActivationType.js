const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {logData} = require('../../helpers/logger')

//Type of activation whether is phone, sms, or reset code
const ActivationType = db.define('activation_type', {

    ID: {
        type: DataTypes.TINYINT,
        allowNull: false,
        primaryKey:true,
        autoIncrement:true
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    }

}
)

ActivationType.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl activation_type: ' + err))

  module.exports = { ActivationType }