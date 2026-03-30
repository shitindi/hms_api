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
const { TenantRegion } = require('../models/Client/Regions')
const { TenantBranch } = require('../models/Client/TenantBranch')
const { Application } = require('../models/Client/Apps')
const { LicensePaymentType } = require('../models/Client/LIcensePyamentType')
const { Category } = require('../models/sales/Category')
const { IDType } = require('../models/lookup/IDType')
const { PaymentStatus } = require('../models/sales/PaymentStatus')
const { Customer } = require('../models/sales/Customer')
const { CustomerType } = require('../models/sales/CustomerType')
const { Inventory } = require('../models/sales/Inventory')
const { Order } = require('../models/sales/Order')
const { OrderItem } = require('../models/sales/OrderItem')
const { Payment } = require('../models/sales/Payment')
const { PaymentStatusHistory } = require('../models/sales/PaymentStatusHistory')
const { Product } = require('../models/sales/Product')
const { Supplier } = require('../models/sales/Supplier')
const { Currrency } = require('../models/sales/Currrency')
const { TaxGroup } = require('../models/lookup/TaxtGroup')
const { orderStatus } = require('../models/sales/OrderSTatus')

const seedAuthDatabase = async () => {
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
        const appCount = await Application.count()
        const payTypeCount = await LicensePaymentType.count()
        const payMethodCount = await LicensePaymentMethod.count()

        const CurrrencyCount = await Currrency.count()
        const paymentStatusCount = await PaymentStatus.count()

        const taxGroupCount = await TaxGroup.count()

        const orderStatusCount = await orderStatus.count()

        if (orderStatusCount == 0) {

            await orderStatus.bulkCreate([
                { id: 1, name: 'Not Paid' },
                { id: 2, name: 'Paid Not delivered' },
                { id: 3, name: 'Paid and delivered' }, 
            ])
        }


        if (taxGroupCount == 0) {
            console.log('taxGroupCount: ', taxGroupCount)
            const taxtGroups = await TaxGroup.bulkCreate([
                { id: 1, name: 'Standard' },
                { id: 2, name: 'Special Rate' },
                { id: 3, name: 'Zero Rated' },
                { id: 4, name: 'Special Relief' },
                { id: 5, name: 'Exempt item' }
            ])

            console.log('Tax Groups: ', taxtGroups)
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
                    { id: 12, item_name: 'Sales Product Categories', module_id: module.id, code: 112 },
                    { id: 13, item_name: 'Customers', module_id: module.id, code: 113 },
                    { id: 14, item_name: 'Customers Type', module_id: module.id, code: 114 },
                    { id: 15, item_name: 'Inventory', module_id: module.id, code: 115 },
                    { id: 16, item_name: 'Order', module_id: module.id, code: 116 },
                    { id: 17, item_name: 'Payment', module_id: module.id, code: 117 },
                    { id: 18, item_name: 'Product', module_id: module.id, code: 118 },
                    { id: 19, item_name: 'Supplier', module_id: module.id, code: 119 },
                    { id: 20, item_name: 'Contacts', module_id: module.id, code: 120 }


                ])
            }
        }

        if (payTypeCount == 0) {

            await LicensePaymentType.bulkCreate([

                { ID: 1, name: 'Bank Transfer' }, { ID: 2, name: 'Cash' }, { ID: 3, name: 'Card' }
            ])
        }

        if (payMethodCount == 0) {

            await LicensePaymentMethod.bulkCreate([
                { ID: 1, name: 'MPESA', created_by: 1 }, { ID: 2, name: 'Mixx by Yas', created_by: 1 }
            ])
        }

        if (contactTypeCount == 0) {
            await ContactType.bulkCreate([
                { ID: 1, name: 'Staff' }, { ID: 2, name: 'Client' }, { ID: 3, name: 'Supplier' }, { ID: 4, name: 'Other' }
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
                {    first_name: 'Ndinao',middle_name: 'Andrew', last_name: 'Shitindi',email: 'ndinao@hotmail.com', 
                    mobile_no: '0715432268',  phone: '0779786152', position: 'Senior Software Developer',address: 'Buyuni chanika', contact_type:1 }
            )
    
            const tenant = await Tenant.create(
                { tenant_name: 'Byteware inc',status_id: 1,contact_id: cont.id, tenant_type:1}
            )
         */
            const user = {
                id: 1, user_name: 'admim@mycompany.com', password: '', must_change_password: false, email_verified: true, sms_verified: true,
                is_active: true, retry_count: 0, user_status: 1, contact_id: 6, tenant_id: 1
            }
            user.password = await hashPassword('Developer@123')

            await User.create(user)
        }

        if (appCount == 0) {

            await Application.create({
                ID: 1, name: 'Sales', description: 'Application for sales'
            })
        }

        if (packageCount == 1) {

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
                { id: 1, code: 'USD', name: 'United States Dollar' }, { id: 2, code: 'TZS', name: 'Tanzania Shilings' }
            ])
        }

        if (paymentStatusCount == 0) {

            await PaymentStatus.bulkCreate([

                { id: 1, name: 'Not Paid' }, { id: 2, name: 'Received' }, { id: 3, name: 'Rejected' }, { id: 4, name: 'Verified' }
            ])
        }

    } catch (error) {
        console.log('SeedDatabase: ' + error)
    }
}

const updateAuthDbSchema = async () => {

    try {


        await orderStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_lkp_order_status: ' + err))

        await Order.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_order: ' + err))



        if (1 != 0)
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



        // Sales lookup
        await IDType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_id_type: ' + err))

        await TaxGroup.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_tax_group: ' + err))


        await Category.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_category: ' + err))

        await IDType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl lookups_tbl_id_type: ' + err))

        await PaymentStatus.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_lkp_payment_status: ' + err))




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

        await Application.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('Create tbl client_tbl_application: ' + err))



        // Sales Details
        await CustomerType.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_customer_type: ' + err))

        await Customer.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl  sales_tbl_customer: ' + err))

        await Supplier.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_supplier: ' + err))

        await Product.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_product: ' + err))

        await Customer.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl  sales_tbl_customer: ' + err))



        await Inventory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_inventory: ' + err))

        await Order.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_order: ' + err))

        await OrderItem.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_order_item: ' + err))


        await Payment.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_tbl_payment: ' + err))


        await PaymentStatusHistory.sync({ alter: true })
            .then(data => { })
            .catch(err => console.log('error Create table tbl sales_lkp_payment_status_history: ' + err))



    } catch (error) {
        console.log('updateDatabse: ' + error)
    }

}


//updateAuthDbSchema()
//seedAuthDatabase()

module.exports = {
    seedAuthDatabase,
    updateAuthDbSchema
}

