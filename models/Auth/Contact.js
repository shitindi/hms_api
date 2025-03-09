const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {ContactType} = require('../Auth/ContactType')

const Contact = db.define('auth_tbl_contact', {
    
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
    mobile_no: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    phone: {
       type: DataTypes.STRING(15),
       allowNull: true
    },
    position: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    address: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    contact_type: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    created_by :{
        type: DataTypes.INTEGER,
        allowNull: true
     },

})


ContactType.hasMany(Contact, {foreignKey: {name: 'contact_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Contact.belongsTo(ContactType, { as: 'ContactType', foreignKey: {name: 'contact_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


const createContactObject = (contactObj) => {

  const contact = {
      first_name: contactObj.first_name,
      middle_name: contactObj.middle_name,
      last_name: contactObj.last_name,
      email: contactObj.email,
      mobile_no:contactObj.mobile_no,
      phone: contactObj.phone,
      position: contactObj.position,
      address: contactObj.address,
      created_by : contactObj?.user_id,
  }
  return contact

}



  module.exports = { 
   Contact,
   createContactObject
}