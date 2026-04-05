const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const {ContactType} = require('../Auth/ContactType')
const { Gender } = require('../Lookup/Gender')
const { Tenant } = require('./Tenant')

const Contact = db.define('auth_tbl_contact', {


    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    } ,
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
     allowNull: true
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
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    created_by :{
        type: DataTypes.INTEGER,
        allowNull: true
     },
     gender_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
     }

})

Contact.hasOne(Tenant, {foreignKey: {name: 'tenant_contact_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Tenant.belongsTo(Contact, {as: 'Contact',foreignKey: {  name: 'tenant_contact_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

ContactType.hasMany(Contact, {foreignKey: {name: 'contact_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Contact.belongsTo(ContactType, { as: 'ContactType', foreignKey: {name: 'contact_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

 Tenant.hasMany(Contact, {foreignKey: {name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
 Contact.belongsTo(Tenant, {as: 'Contact',foreignKey: {  name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

 Gender.hasMany(Contact, {foreignKey: {name: 'gender_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Contact.belongsTo(Gender, {as: 'Gender',foreignKey: {  name: 'gender_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


  module.exports = { 
   Contact
}