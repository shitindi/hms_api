const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { IDType } = require('../Lookup/IDType')
const {Gender} = require('../Lookup/Gender')
const {MaritalStatus} = require('../Lookup/MaritalStatus')
const {BloodGroup} = require('../Lookup/BloodGroup')
const { Contact } = require('../Auth/Contact')
const { User } = require('../Auth/User')

const Patient = db.define('main_tbl_patient', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    }, 
    contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_type: {
        type: DataTypes.TINYINT,
        allowNull: true,
    },
    id_number: {
        type: DataTypes.STRING
    },
    marital_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    blood_group: {
        type: DataTypes.TINYINT,
    },
    next_kin_name: {
       type: DataTypes.STRING,
       allowNull: false 
    },
    next_kin_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    next_kin_phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    joining_date: {
        type: DataTypes.DATEONLY
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

}
)

User.hasMany(Patient, {foreignKey: {name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(User, {as: 'CreatedBy',foreignKey: {  name: 'created_by', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Contact.hasOne(Patient, {foreignKey: {name: 'contact_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(Contact, {as: 'Contact',foreignKey: {  name: 'contact_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

IDType.hasMany(Patient, {foreignKey: {name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(IDType, {as: 'IdType',foreignKey: {  name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

MaritalStatus.hasMany(Patient, {foreignKey: {name: 'marital_status_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(MaritalStatus, {as: 'MaritalStatus',foreignKey: {  name: 'marital_status_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

BloodGroup.hasMany(Patient, {foreignKey: {name: 'blood_group_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(BloodGroup, {as: 'BloodGroup',foreignKey: {  name: 'blood_group_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})



module.exports = { Patient}