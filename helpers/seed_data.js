const { logData } = require('../helpers/logger')
const { ActivationCode } = require('../models/Auth/ActivationCode')
const { ActivationType } = require('../models/Auth/ActivationType')
const { ActiveSession } = require('../models/Auth/ActiveSession')
const { Contact } = require('../models/Auth/Contact')
const { LoginAttempt } = require('../models/Auth/LoginAttempt')
const { PasswordHistory } = require('..//models/Auth/PasswordHistory')
const { SessionHistory } = require('../models/Auth/SessionHistory')
const { Tenant } = require('../models/Auth/Tenant')
const { TenantStatus } = require('../models/Auth/TenantStatus')
const { TenantStatusHistory } = require('../models/Auth/TenantStatusHistory')
const { User } = require('../models/Auth/User')
const { UserStatus } = require('../models/Auth/UserStatus')
const { UserStatusHistory } = require('../models/Auth/UserStatusHistory')

const { PersmissionType } = require('../models/Auth/PermisionType')
const { Group } = require('../models/Auth/Group')
const { UserGroup } = require('../models/Auth/UserGroup')
const { GroupPermission } = require('../models/Auth/GroupPermission')
const { Module } = require('../models/Auth/Module')
const { ModuleItem } = require('../models/Auth/ModuleItem')
const { UserPermission } = require('../models/Auth/UserPermission')

const { ActivityLog } = require('../models/Auth/ActivityLog')
const { ActivityType } = require('../models/Auth/ActivityType')
const { ContactType } = require('../models/Auth/ContactType')

const { hashPassword } = require('./hash_data')
const { TenantType } = require('../models/Auth/TenantType')
const { LicensePackage } = require('../models/Client/LicensePackage')
const { LicenseBranchCount } = require('../models/Client/LicenseBranchCount')
const { LicenseUserCount } = require('../models/Client/LIcenseUserCount')
const { TenantLicense } = require('../models/Client/TenantLicense')
const { LicensePayment } = require('../models/Client/LicensePayment')
const { LicensePaymentMethod } = require('../models/Client/LicensePaymentMethod')
const { TenantCountry } = require('../models/Client/Countries')
const { TenantLicenseHistory } = require('../models/Client/TenantLicenseHistory')
const { TenantRegion } = require('../models/Lookup/Regions')
const { TenantBranch } = require('../models/Client/TenantBranch')
//const { Application } = require('../models/Client/Apps')
const { LicensePaymentType } = require('../models/Client/LIcensePyamentType')
const { IDType } = require('../models/Lookup/IDType')
const { PaymentStatus } = require('../models/Main/PaymentStatus')
const { Payment } = require('../models/Main/Payment')
const { PaymentStatusHistory } = require('../models/Main/PaymentStatusHistory')
//const { Currency } = require('../models/Lookup/Currency')
const { Gender } = require('../models/Lookup/Gender')
const { MaritalStatus } = require('../models/Lookup/MaritalStatus')
const { BloodGroup } = require('../models/Lookup/BloodGroup')
const { Department } = require('../models/Lookup/Department')
const { Specialization } = require('../models/Lookup/Specialization')
const { EmploymentType } = require('../models/Lookup/EmploymentType')
const { Priority } = require('../models/Lookup/Priority')
const { AppointmentType } = require('../models/Lookup/AppointmentType')
const { AppointmentStatus } = require('../models/Lookup/AppointmentStatus')
const { Appointment } = require('../models/Main/Apointment')
const { Doctor } = require('../models/Main/Doctor')
const { Insurer } = require('../models/Main/Insurer')
const { Patient } = require('../models/Main/Patient')
const { PatientInsurer } = require('../models/Main/PatientInsurer')
const { Order } = require('../models/Main/Order')
const { OrderStatus } = require('../models/Lookup/OrderStatus')
const { Currrency } = require('../models/Lookup/Currency')
const { BillingOption } = require('../models/Lookup/BillingtOption')
const { PatientActivity } = require('../models/Lookup/PatientActivity')
const { PatientJourney } = require('../models/Main/PatientJourney')
const { licensePackage } = require('./validator/client_validation_schema')
const { DefaultRole } = require('../models/Auth/DefaultRole')
const { PatientVital } = require('../models/Main/PatientVital')
const { LabTestCategory } = require('../models/Lookup/LabTestCategory')
const { LabTestCatalog } = require('../models/Main/LabTestCatalog')
const { LabResultStatus } = require('../models/Lookup/LabResultStatus')
const { LabRequest } = require('../models/Main/LabRequest')
const { MedicineForm } = require('../models/Lookup/Medicineform')
const { Medicine } = require('../models/Main/Medicine')
const { PrescriptionStatus } = require('../models/Lookup/PrescriptionStatus')
const { Prescription } = require('../models/Main/Prescription')
const { AppointmentChecklist } = require('../models/Main/AppointmentChecklist')
const { BillingService } = require('../models/Lookup/BillingService')
const { Billing } = require('../models/Main/Billing')
const { BillingItem } = require('../models/Main/BillingItem')
const { AdmissionSequence } = require('../models/Main/AdmissionSequence')

const seedDatabase = async () => {
    try {


        const activationTypesCount = await ActivationType.count()
        const tenantStatusCount = await TenantStatus.count()
        const userStatusCount = await UserStatus.count()
        const usersCount = await User.count()
        const permissionTypCount = await PersmissionType.count()
        const activityTypeCount = await ActivityType.count()
        const moduleCount = await Module.count()
        const contactTypeCount = await ContactType.count()
        const tenantType = await TenantType.count()
        const packageCount = await LicensePackage.count()
        // const appCount = await Application.count()
        const payTypeCount = await LicensePaymentType.count()
        const payMethodCount = await LicensePaymentMethod.count()

        const CurrrencyCount = await Currrency.count()
        const paymentStatusCount = await PaymentStatus.count()

        const IdTypeCount = await IDType.count()
        const GenderCount = await Gender.count()
        const MaritalStatusCount = await MaritalStatus.count()
        const BloodGroupCount = await BloodGroup.count()

        const DepartmentCount = await Department.count()
        const SpecializationCount = await Specialization.count()
        const EmploymentTypeCount = await EmploymentType.count()

        const PriorityCount = await Priority.count()
        const AppointmentTypeCount = await AppointmentType.count()
        const AppointmentStatusCount = await AppointmentStatus.count()

        const TenantRegionsCount = await TenantRegion.count()
        const BillingOptionCount = await BillingOption.count()
        const PattientActivitiesCount = await PatientActivity.count()
        const InsurerCount = await Insurer.count()

        //Initial license details
        const LicensePaymentsCount = await LicensePayment.count()
        const TenantLicenseCount = await TenantLicense.count()
        const LicensePackageCount = await LicensePackage.count()
        const LisenseUserCounts = await LicenseUserCount.count()

        const DefaultRolesCount = await DefaultRole.count()
        const LabTestCategoryCount = await LabTestCategory.count()
        const LabResultStatusCount = await LabResultStatus.count()
        const MedicalFormCount = await MedicineForm.count()
        const PrescriptionStatusCount = await PrescriptionStatus.count()

        const BillingServicesCount = await BillingService.count()

        if (BillingServicesCount == 0) {
            await BillingService.bulkCreate([
                { ID: 1, name: 'Consultation' }, { ID: 2, name: 'Lab Services' },
                { ID: 3, name: 'Pharmacy Services' }, { ID: 4, name: 'Clinical Services' },
                { ID: 5, name: 'Admission Services' }, { ID: 6, name: 'Imaging Services' },
                { ID: 7, name: 'Emergnecy Services' }
            ])
        }

        if (PrescriptionStatusCount == 0) {
            await PrescriptionStatus.bulkCreate([
                { id: 1, name: 'Pending' }, { id: 2, name: 'Dispensed' },
                { id: 3, name: 'Partial Dispensed' }, { id: 4, name: 'Cancelled' }
            ])
        }

        if (MedicalFormCount == 0) {
            await MedicineForm.bulkCreate([
                { id: 1, name: 'Tablet' }, { id: 2, name: 'Capsule' },
                { id: 3, name: 'Syrup' }, { id: 4, name: 'Injection' }
            ])
        }

        if (LabResultStatusCount == 0) {
            await LabResultStatus.bulkCreate([
                { id: 1, name: 'Normal' }, { id: 2, name: 'High' },
                { id: 3, name: 'Low' }, { id: 4, name: 'Abnormal' }
            ])
        }
        if (LabTestCategoryCount == 0) {
            await LabTestCategory.bulkCreate([
                { id: 1, name: 'Hematology' }, { id: 2, name: 'Biochemistry' },
                { id: 3, name: 'Microbiology' }, { id: 4, name: 'Urine' },
                { id: 5, name: 'Stool' }, { id: 6, name: 'Hormonal' },
                { id: 7, name: 'Cardiac' },
            ])
        }

        if (DefaultRolesCount == 0) {
            await DefaultRole.bulkCreate([
                { ID: 1, name: 'ADMIN' }, { ID: 2, name: 'DOCTOR' },
                { ID: 3, name: 'PHARMACIST' }, { ID: 4, name: 'RECEPTIONIST' },
                { ID: 5, name: 'CASHIER' }, { ID: 6, name: 'WARD STAFF' },
            ])
        }

        if (LisenseUserCounts == 0) {
            await LicenseUserCount.create({
                ID: 1,
                description: 'Addition of extra users',
                user_count: 1000,
                price: 1000000,
                is_active: true,
                created_by: 1
            })
        }

        if (LicensePaymentsCount == 0) {
            await LicensePayment.create({
                id: 1,
                tenant_id: 1,
                payment_type: 1,
                payment_method: 1,
                amount: 1000000,
                additional_user: 1,
            })
        }

        if (LicensePackageCount == 0) {
            LicensePackage.create({
                id: 1,
                package_name: 'Demo package',
                description: 'Demo package for web app',
                user_count: 1000,
                branch_count: 100,
                price: 1000000,
                created_by: 1,
                is_active: true

            })
        }


        if (TenantLicenseCount == 0) {
            await TenantLicense.create(
                {
                    id: 1,
                    tenant_id: 1,
                    start_date: '2026-04-02 ',
                    end_date: '2027-04-02 ',
                    package_id: 1,
                    user_count_id: 1,
                    payment_id: 1,
                    license_duration_month: 12,
                    is_active: true
                }
            )
        }




        if (InsurerCount == 0) {
            await Insurer.bulkCreate([
                { id: 1, name: 'NHIF' }, { id: 2, name: 'Diamond' }, { id: 3, name: 'Strategis' }
            ])
        }

        if (PattientActivitiesCount == 0) {
            await PatientActivity.bulkCreate([
                { ID: 1, name: "Reception", is_active: true },
                { ID: 2, name: "Doctor appointment", is_active: true },
                { ID: 3, name: "Initial Assessment", is_active: true },
                { ID: 4, name: "Doctor consulation", is_active: true },
                { ID: 5, name: "Medicine prescription", is_active: true },
                { ID: 6, name: "Laboratory or diagnosting testing", is_active: true },
                { ID: 7, name: "Clinical procedure", is_active: true },
                { ID: 8, name: "Doctor review of results", is_active: true },
                { ID: 9, name: "Pharmacy", is_active: true },
                { ID: 10, name: "Billing and payments", is_active: true },
                { ID: 11, name: "Admission", is_active: true },
                { ID: 12, name: "Discharged", is_active: true },
                { ID: 13, name: "Permitted", is_active: false },
            ])
        }

        if (BillingOptionCount == 0) {
            await BillingOption.bulkCreate([
                { ID: 1, name: 'Cash' }, { ID: 2, name: 'Insured' }, { ID: 3, name: 'Billing' },
            ])
        }

        if (TenantRegionsCount == 0) {
            await TenantRegion.bulkCreate([
                { ID: 1, name: 'Dar es Salaam', region_code: 1 }, { ID: 2, name: 'Moshi', region_code: 2 },
                { ID: 3, name: 'Mbeya', region_code: 3 }
            ])
        }

        if (PriorityCount == 0) {
            await Priority.bulkCreate([
                { ID: 1, name: 'Normal' }, { ID: 2, name: 'Urgent' }, { ID: 3, name: 'High priority' }
            ])
        }

        if (AppointmentTypeCount == 0) {
            await AppointmentType.bulkCreate([
                { ID: 1, name: 'Consultation' }, { ID: 2, name: 'Follow-up' }, { ID: 3, name: 'Review' }, { ID: 4, name: 'Emergency review' }
            ])
        }

        if (AppointmentStatusCount == 0) {
            await AppointmentStatus.bulkCreate([
                { ID: 1, name: 'Waiting' }, { ID: 2, name: 'Confirmed' }, { ID: 3, name: 'Checked-in' },
                { ID: 4, name: 'Canceled' }, { ID: 5, name: 'Completed' }, { ID: 6, name: 'Overdue' }
            ])
        }

        if (IdTypeCount == 0) {
            await IDType.bulkCreate([
                { ID: 1, name: 'National Id' }, { ID: 2, name: 'Voter ID' }, { ID: 3, name: 'Driving License' }, { ID: 4, name: 'Passport' }
            ])
        }

        if (GenderCount == 0) {
            await Gender.bulkCreate([
                { ID: 1, name: 'Male' }, { ID: 2, name: 'Female' }
            ])
        }

        if (MaritalStatusCount == 0) {
            await MaritalStatus.bulkCreate([
                { ID: 1, name: 'Single' }, { ID: 2, name: 'Married' }, { ID: 3, name: 'Divorced' }, { ID: 4, name: 'Widowed' },
            ])
        }

        if (BloodGroupCount == 0) {
            await BloodGroup.bulkCreate([
                { ID: 1, name: 'A+' }, { ID: 2, name: 'A-' }, { ID: 3, name: 'B+' }, { ID: 4, name: 'B-' },
                { ID: 5, name: 'O+' }, { ID: 6, name: 'O-' }, { ID: 7, name: 'AB+' }, { ID: 8, name: 'AB-' },
            ])
        }


        if (DepartmentCount == 0) {
            await Department.bulkCreate([
                { ID: 1, name: 'General Medicine' }, { ID: 2, name: 'Cardiology' }, { ID: 3, name: 'Gynecology' },
            ])
        }

        if (SpecializationCount == 0) {
            await Specialization.bulkCreate([
                { ID: 1, name: 'General Medicine' }, { ID: 2, name: 'Cardiology' }, { ID: 3, name: 'Gynecology' },
            ])
        }

        if (EmploymentTypeCount == 0) {
            await EmploymentType.bulkCreate([
                { ID: 1, name: 'Full time' }, { ID: 2, name: 'Part time' }, { ID: 3, name: 'Visiting Consultant' },
            ])
        }

        if (tenantType == 0) {
            await TenantType.bulkCreate([
                { ID: 1, name: 'Power User' }, { ID: 2, name: 'Customer' }
            ])
        }

        if (moduleCount == 0) {
            const module = await Module.create({
                id: 1,
                module_name: 'User management',
                code: 1001,
                description: 'User, roles and permission managements',
                is_active: true
            })

            if (module && module.id > 0) {
                ModuleItem.bulkCreate([
                    { id: 1, item_name: 'Users', module_id: module.id, code: 101 },
                    { id: 2, item_name: 'Groups', module_id: module.id, code: 102 },
                    { id: 3, item_name: 'User Group', module_id: module.id, code: 103 },
                    { id: 4, item_name: 'Group Permission', module_id: module.id, code: 104 },
                    { id: 5, item_name: 'User Permission', module_id: module.id, code: 105 },
                    { id: 6, item_name: 'License Packages', module_id: module.id, code: 106 },
                    { id: 7, item_name: 'Payment method', module_id: module.id, code: 107 },
                    { id: 8, item_name: 'License User Count', module_id: module.id, code: 108 },
                    { id: 9, item_name: 'Branch User Count', module_id: module.id, code: 109 },
                    { id: 10, item_name: 'Tenant details', module_id: module.id, code: 110 },
                    { id: 11, item_name: 'Tenant Branch details', module_id: module.id, code: 111 },
                    { id: 12, item_name: 'Patient details', module_id: module.id, code: 112 },
                    { id: 13, item_name: 'Doctors details', module_id: module.id, code: 113 },
                    { id: 14, item_name: 'Apointment details', module_id: module.id, code: 114 },
                    { id: 15, item_name: 'Medicine details', module_id: module.id, code: 115 },
                    { id: 16, item_name: 'Billing details', module_id: module.id, code: 116 },


                ])
            }
        }

        if (payTypeCount == 0) {

            await LicensePaymentType.bulkCreate([

                { ID: 1, name: 'Cash' }, { ID: 2, name: 'Mobile Money' },
                { ID: 3, name: 'Bank Transfer' }, { ID: 4, name: 'Card' },
                { ID: 5, name: 'Isurance' }
            ])
        }

        if (payMethodCount == 0) {

            await LicensePaymentMethod.bulkCreate([
                { ID: 1, name: 'MPESA', created_by: 1 }, { ID: 2, name: 'Mixx by Yas', created_by: 1 }
            ])
        }

        if (contactTypeCount == 0) {
            await ContactType.bulkCreate([
                { ID: 1, name: 'Doctor', is_active: true }, { ID: 2, name: 'Administration', is_active: true },
                { ID: 3, name: 'Pattient', is_active: false }, { ID: 4, name: 'Medical staff', is_active: false }

            ])
        }

        if (activityTypeCount == 0) {
            await ActivityType.bulkCreate([
                { ID: 1, name: 'Create' }, { ID: 2, name: 'Modify' }, { ID: 3, name: 'Delete' }, { ID: 4, name: 'View' }
            ])
        }

        if (activationTypesCount == 0) {
            await ActivationType.bulkCreate([
                { ID: 1, name: 'Email Activation' }, { ID: 2, name: 'SMS Activation' }, { ID: 3, name: 'OTP code' }, { ID: 4, name: 'Password reset' }
            ])
        }

        if (tenantStatusCount == 0) {
            await TenantStatus.bulkCreate([
                { ID: 1, name: 'Active' }, { ID: 2, name: 'Suspended' }, { ID: 3, name: 'Deleted' }
            ])
        }

        if (userStatusCount == 0) {

            await UserStatus.bulkCreate([
                { ID: 1, name: 'Active' }, { ID: 2, name: 'Blocked by System' }, { ID: 3, name: 'Locked by user' }, { ID: 4, name: 'Deleted' }, { ID: 5, name: 'Not verified' }
            ])
        }


        if (usersCount == 0) {
            /*
            const  cont = await Contact.create(
                {    first_name: 'Ndinao',middle_name: 'Andrew', last_name: 'Shitindi',email: 'ndinao@hotmail.com', gender_id:1,
                    mobile_no: '0715432268',  phone: '0779786152', position: 'Senior Software Developer',address: 'Buyuni chanika', contact_type:1 }
            )
    
            const tenant = await Tenant.create(
                { tenant_name: 'Byteware inc',status_id: 1,contact_id: cont.id, tenant_type:1}
            )
        */
            const user = {
                id: 1, user_name: 'admim@mycompany.com', password: '', must_change_password: false, email_verified: true, sms_verified: true,
                is_active: true, retry_count: 0, user_status: 1, contact_id: 1, tenant_id: 1
            }
            user.password = await hashPassword('Admin@123')

            await User.create(user)
        }


        if (packageCount == 0) {

            await LicensePackage.create(
                { id: 1, package_name: 'demo pack', description: 'Demo package for review', user_count: '1', branch_count: '0', price: 0, app_id: 1, created_by: 1, is_active: 0 },
                // { id: 2, package_name: 'Starter pack', description:'To begin with few user and branch', user_count:'2', branch_count:'2', price:120000,app_id:1,created_by:1, is_active:1}
            )
        }


        if (permissionTypCount == 0) {
            await PersmissionType.bulkCreate([
                { ID: 1, name: 'Read only' }, { ID: 2, name: 'Ready and write' }, { ID: 3, name: 'No Access' }
            ])
        }

        if (CurrrencyCount == 0) {

            await Currrency.bulkCreate([
                { id: 1, code: 'TZS', name: 'Tanzania Shilings' }, { id: 2, code: 'USD', name: 'United States Dollar' }
            ])
        }

        if (paymentStatusCount == 0) {

            await PaymentStatus.bulkCreate([

                { id: 1, name: 'Not Paid' }, { id: 2, name: 'Received' }, { id: 3, name: 'Rejected' },
                { id: 4, name: 'Verified' }, { id: 5, name: 'Partial received' }, { id: 6, name: 'Insured' }
            ])
        }

    } catch (error) {
        console.log('SeedDatabase: ' + error)
    }
}

const updateDbSchema = async () => {

    try {

        await AdmissionSequence.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_admission_sequence: ' + err))

        return


        await LicensePaymentType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl license_payment_type: ' + err))

        //Lookups

        await ActivationType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl activation_type: ' + err))

        await TenantStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl Tenant_status: ' + err))

        await UserStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl UserStatus: ' + err))

        await PersmissionType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_permision_type: ' + err))

        await ActivityType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_activity_type: ' + err))

        await ContactType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl contact_type: ' + err))

        await TenantType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl tenant_type: ' + err))

        await TenantRegion.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_lkp_region: ' + err))

        await TenantCountry.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl lkp_countries: ' + err))

        await IDType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_id_type: ' + err))

        await IDType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_id_type: ' + err))

        await PaymentStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_lkp_payment_status: ' + err))

        await AppointmentStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_appointment_status: ' + err))

        await AppointmentType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_appointment_type: ' + err))

        await BloodGroup.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_blood_group: ' + err))

        await Department.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_department: ' + err))

        await EmploymentType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_employment_type: ' + err))

        await Gender.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_gender: ' + err))

        await MaritalStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_marital_status: ' + err))

        await Specialization.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_specialization: ' + err))

        await Priority.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_appointment_priority: ' + err))

        await Currrency.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error create table lookup_tbl_currency: ' + err))

        await OrderStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookup_tbl_order_status: ' + err))

        await BillingOption.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_billing_option: ' + err))

        await PatientActivity.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_patient_activities : ' + err))

        await LabTestCategory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_lab_test_category: ' + err))

        await LabResultStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_lab_result_status: ' + err))

        await MedicineForm.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_medicine_form: ' + err))

        await PrescriptionStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_prescription_status: ' + err))

        // END OF LOOKUPS


        await PatientJourney.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl main_tbl_patient_journey: ' + err))

        await Tenant.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl Tenant: ' + err))

        await TenantStatusHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl tenant_status_history: ' + err))

        await Contact.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl Contact: ' + err))

        await User.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl User: ' + err))

        await LicensePaymentMethod.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_lkp_license_payment_method: ' + err))

        await ActivationCode.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl activation_code: ' + err))


        await SessionHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl SessionHistory: ' + err))

        await PasswordHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl password_history: ' + err))


        await LoginAttempt.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl LoginAttempt: ' + err))

        await ActiveSession.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl ActiveSession: ' + err))

        await UserStatusHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl user_status_history: ' + err))

        await Group.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_group: ' + err))

        await UserGroup.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_user_group: ' + err))



        // module data
        await Module.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_module: ' + err))

        await GroupPermission.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_group_permission: ' + err))

        await UserPermission.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_user_permission: ' + err))

        await ActivityLog.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_activity_log: ' + err))

        await ModuleItem.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl auth_tbl_module_item ' + err))




        // Client details
        await LicenseBranchCount.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_license_branch_count: ' + err))


        await LicenseUserCount.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_license_user_count: ' + err))

        await TenantLicense.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_license: ' + err))

        await LicensePackage.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_license_packages: ' + err))

        await LicensePayment.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_lkp_license_payment: ' + err))


        await TenantBranch.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_tenant_branch: ' + err))


        await TenantLicenseHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_license_history: ' + err))




        // Main Details


        await Payment.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_payment: ' + err))

        await PaymentStatusHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_lkp_payment_status_history: ' + err))

        await Appointment.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_apointment: ' + err))

        await Doctor.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_doctor: ' + err))

        await Insurer.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_insure: ' + err))

        await Patient.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_patient: ' + err))

        await PatientInsurer.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_patient_insurer: ' + err))

        await Order.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_order: ' + err))

        await DefaultRole.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_default_roles: ' + err))

        await PatientVital.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_patient_vital: ' + err))

        await LabTestCatalog.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_lab_test_catalog: ' + err))

        await LabRequest.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_lab_request: ' + err))

        await Medicine.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_medicine: ' + err))

        await Prescription.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_prescription: ' + err))

        await AppointmentChecklist.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl main_tbl_apointment_checklist: ' + err))

        return
    } catch (error) {
        console.log('updateDatabse: ' + error)
    }

}


updateDbSchema()
//seedDatabase()

module.exports = {
    seedDatabase,
    updateDbSchema
}

