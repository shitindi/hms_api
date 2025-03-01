const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {logData} = require('../../helpers/logger')
const {User} = require('./User')

const Contact = db.define('contact', {
    
    first_name: {
       type: DataTypes.STRING(30),
       allowNull: false,
    },
    
    middle_name: {
       type: DataTypes.STRING(30),
       allowNull: true,
    },
    last_name: {
       type: DataTypes.STRING(30),
       allowNull: false,
    },
    email:{
     type: DataTypes.STRING(50),
     unique: true
    },
    phone: {
       type: DataTypes.STRING(15),
       unique: true,
       allowNull: true
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    created_by :{
        type: DataTypes.INTEGER,
        allowNull: false
     },

})

Contact.hasOne(User, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})
User.belongsTo(Contact, {foreignKey: {name: 'contact_id', allowNull: false}, onUpdate: 'CASCADE'})


User.hasMany(Contact, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})
Contact.belongsTo(User, {foreignKey: {name: 'created_by', allowNull: false}, onUpdate: 'CASCADE'})

Contact.sync({alter: true})
  .then( data =>{})
  .catch( err => logData('Create tbl Contact: ' + err))

  module.exports = { Contact}