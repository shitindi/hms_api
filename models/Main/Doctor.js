const  {sequelize:db, DataTypes} = require('../../helpers/sequelize_init')
const { IDType } = require('../Lookup/IDType')
const {Gender} = require('../Lookup/Gender')
const { Department } = require('../Lookup/Department')
const { Specialization } = require('../Lookup/Specialization')
const { EmploymentType } = require('../Lookup/EmploymentType')
const { User } = require('../Auth/User')

const Doctor = db.define('main_tbl_doctor', {

    tenant_id: {
        type:DataTypes.INTEGER,
        allowNull: false
    }, 
    user_id: {
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
    doctor_id_no: {
        type: DataTypes.STRING
    },
    license_number: {
        type: DataTypes.STRING
    },
    department: {
        type: DataTypes.TINYINT,
    },
    specialization: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    hightest_qualification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year_of_experience: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    employment_type: {
        Type: DataTypes.TINYINT,
        allowNull: false
    },
    joining_date: {
        type: DataTypes.DATEONLY,
        allowNull:false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}
)

IDType.hasMany(Doctor, {foreignKey: {name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Doctor.belongsTo(IDType, {as: 'IdType',foreignKey: {  name: 'id_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

Department.hasMany(Doctor, {foreignKey: {name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Doctor.belongsTo(Department, {as: 'Department',foreignKey: {  name: 'department_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


Specialization.hasMany(Doctor, {foreignKey: {name: 'specialization_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Doctor.belongsTo(Specialization, {as: 'Specialization',foreignKey: {  name: 'specialization_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

EmploymentType.hasMany(Doctor, {foreignKey: {name: 'employment_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Doctor.belongsTo(EmploymentType, {as: 'EmploymentType',foreignKey: {  name: 'employment_type', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})

User.hasOne(Doctor, {foreignKey: {name: 'user_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})
Doctor.belongsTo(User, {as: 'User',foreignKey: {  name: 'user_id', allowNull: true}, onDelete: 'NO ACTION', onUpdate: 'CASCADE'})


module.exports = {Doctor}