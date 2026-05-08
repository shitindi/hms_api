const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { IDType } = require('../Lookup/IDType')
const {Gender} = require('../Lookup/Gender')
const {MaritalStatus} = require('../Lookup/MaritalStatus')
const {BloodGroup} = require('../Lookup/BloodGroup')
const { Contact } = require('../Auth/Contact')
const { User } = require('../Auth/User')
const { PatientActivity } = require('../Lookup/PatientActivity')
const { Insurer } = require('./Insurer')
const { Tenant } = require('../Auth/Tenant')

const Patient = db.define('main_tbl_patient', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    }, 
    registration_no: {
        type: DataTypes.STRING,
        unique: true
    },
    contact_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_type: {
        type: DataTypes.SMALLINT,
        allowNull: true,
    },
    id_number: {
        type: DataTypes.STRING
    },
    marital_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    blood_group: {
        type: DataTypes.SMALLINT,
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

    insurer_id: {
        type: DataTypes.SMALLINT,
        allowNull: true
    },
    insurance_number: {
        type: DataTypes.STRING,
        allowNull: true
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

Tenant.hasMany(Patient, {foreignKey: {name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(Tenant, {as: 'Tenant',foreignKey: {  name: 'tenant_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


User.hasMany(Patient, {foreignKey: {name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(User, {as: 'CreatedBy',foreignKey: {  name: 'created_by', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Contact.hasOne(Patient, {foreignKey: {name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(Contact, {as: 'Contact',foreignKey: {  name: 'contact_id', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

IDType.hasMany(Patient, {foreignKey: {name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(IDType, {as: 'IdType',foreignKey: {  name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

MaritalStatus.hasMany(Patient, {foreignKey: {name: 'marital_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(MaritalStatus, {as: 'MaritalStatus',foreignKey: {  name: 'marital_status', allowNull: false}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

BloodGroup.hasMany(Patient, {foreignKey: {name: 'blood_group', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(BloodGroup, {as: 'BloodGroup',foreignKey: {  name: 'blood_group', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Insurer.hasMany(Patient, {foreignKey: {name: 'insurer_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Patient.belongsTo(Insurer, {as: 'Insurer',foreignKey: {  name: 'insurer_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = { Patient}