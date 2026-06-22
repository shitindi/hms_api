//require('../models/Auth/Associations')
const {Tenant: Tenants} = require('../models/Auth/Tenant')
const {User: Users, createUserObject} = require('../models/Auth/User');
const {Contact: Contacts, createContactObject} = require('../models/Auth/Contact')
const { Op, where } = require('sequelize')

const {logData} = require('../helpers/logger')
const { LoginAttempt } = require('../models/Auth/LoginAttempt')
const { ActiveSession } = require('../models/Auth/ActiveSession')
const { SessionHistory} = require('../models/Auth/SessionHistory')
const {PasswordHistory} = require('../models/Auth/PasswordHistory')

const createError = require('http-errors');
const { addHourDbDateNow, getDbDateNow, addMinutesDbDate, getJSDateFromDb, addMonthsDbDateNow, addDaysDbDateNow, addDaysDbDateFromDate, addMonthsDbDateFromDate, getDifferenceInDate } = require('../helpers/utility')
const {authSchema, passUpdate, emailSchema, passReset, contactSchema, userSchema, tenantSchema} = require('../helpers/validator/auth_validation_schema')
const {licensePayment} = require('../helpers/validator/client_validation_schema')
const  hash = require('../helpers/hash_data')
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');
//const client = require('../helpers/init_redis');

const {getRandomString, getRandomNumber} = require('../helpers/code_generator')
const {ActivationCode: ActivationCodes} = require('../models/Auth/ActivationCode')
const {encryptSymmetric: encryp, decryptSymmetric: decrypt} = require('../helpers/cryptography')
const {sendMail} = require('../helpers/mailing');
const { sequelize } = require('../helpers/sequelize_init');
const { UserStatusHistory } = require('../models/Auth/UserStatusHistory');
const { UserPermission } = require('../models/Auth/UserPermission');
const { GroupPermission } = require('../models/Auth/GroupPermission');
const { UserGroup } = require('../models/Auth/UserGroup');
const {Group} = require('../models/Auth/Group');

const {LicensePayment} = require('../models/Client/LicensePayment')
const {TenantLicense} =  require('../models/Client/TenantLicense');
const { TenantLicenseHistory } = require('../models/Client/TenantLicenseHistory');

const register = async (req, res, next) => {

    const transaction = await sequelize.transaction();
    try {
     
        // Validate request data
        //const user = await authSchema.validateAsync(req.body);   //This will throw error which will be catched in catch block
        let user = await userSchema.validateAsync(req.body)
        let contact = await contactSchema.validateAsync(req.body)
        let tenant = await tenantSchema.validateAsync(req.body)
        let payment = await licensePayment.validateAsync(req.body)

        
        // const Contact = await Contacts.findOne({
        //     where: {email: contact.email}
        // })

        //if (Contact) throw createError.Conflict(`${contact.email} is already been registered`)

        // Check if tenant already exists
        let tenants = await Tenants.findOne({
            where: {tenant_name: tenant.tenant_name}
        })

        if (tenants) throw createError.Conflict(`Business name ${tenant.tenant_name} already exists!`)

          tenant.tenant_contact_id = contact.id
        tenant.tenant_type=2
        tenant.status_id=1

        tenant = await Tenants.create(tenant, {transaction})
        
        // Check user if exists
        let User = await Users.findOne({
            where: { user_name: user.user_name }
        }
        );

        if (User) throw createError.Conflict(`${user.user_name} is already been registered!`)

        contact = await Contacts.create(contact, {transaction})

        await Tenants.update( tenant,
           { where: {id: tenant.id}, fields: ['tenant_contact_id']},
           {transaction}  
        )

        const userPassword =  await hash.hashPassword(user.password)
        user.password = userPassword
        user.contact_id = contact.id
        user.tenant_id = tenant.id
        const result= await Users.create(user, {transaction})
        
        // const accessToken = await signAccessToken(User.user_name,User.id, User.tenant_id, userPermissions)
            const accessToken = await signAccessToken(result, [])
           
            const refreshToken = await signRefreshToken(result.id)

            //Log first password usage
            const passUsage = {
                user_id: result.id,
                password: userPassword,
                start_date: getDbDateNow() ,
                is_active: true
            
            }
            await PasswordHistory.create(passUsage, {transaction})

            const userStatHistory = {
                user_id: result.id,
                status_id: 5,
                description: 'First time user created without verification',
                event_date: getDbDateNow()
            }

           await UserStatusHistory.create(userStatHistory, {transaction})

           
          payment .tenant_id = tenant.id
          const paymentRes = await LicensePayment.create(payment, {transaction})


          // create license
          const license = {
            tenant_id: tenant.id,
            start_date: getDbDateNow(),
            end_date: addMonthsDbDateNow(12) ,
            package_id:  payment.package,
            payment_id:paymentRes.id,
            license_duration_month: 12,
            is_active:1
          }

            await TenantLicense.create(license, {transaction})

            // create license history
            await TenantLicenseHistory.create(license, {transaction})

            //Create email verification link
            await generateVerificationEmail(result.id, contact.email, contact.email, transaction)

            await transaction.commit()

            result.password = ""
            res.status(201).json({
                message: "Account created successfully",
                accessToken,
                refreshToken,
                data:result
            })

    } catch (error) {
       await transaction.rollback()
        if (error.isJoi === true) error.status = 422
        logData('Register: ' + error)
        next(error)
    
    }
}

const generateVerificationEmail = async (userId, email, name, transaction) => {
    try{
          
        // Generate tokens to be inserted into
        const token = getRandomString(64)
        const activationCode = {
            user_id: userId,
            activation_type: 1,
            user_token: token,
            expire_at: addHourDbDateNow(72)
    }

    await ActivationCodes.destroy({where: {user_id: userId}}, {transaction})

    await ActivationCodes.create(activationCode, {  transaction});
        

    let tokenJson = {
        user_id: userId,
        token: token
    }
    tokenText = JSON.stringify(tokenJson)
        
    const key =  process.env.CRYPTOGRAPHY_SECRET
    const serviceUrl = process.env.MAIL_ACTIVATION_URL

    const crypoData =  encryp(key, tokenText)

    const mailToken = {
        referer: crypoData.ciphertext,
        nonce: crypoData.iv,
        tag: crypoData.tag
    }

    const tokenString = JSON.stringify(mailToken)
    

    
    const tokenToBase64 = Buffer.from(tokenString).toString('base64')
 
    const activationLink = `${serviceUrl}?lnk=${tokenToBase64}`

   
    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>Thanks  you for creating acount with us, please click the link bellow to activate your account </p>'
          textBody += `<p><a href="${activationLink}">Activate My Account</a></p>`


          await sendMail(email, textBody)
    
    }catch(err){
        logData('generateVerificationEmail: ' + err)
        throw(err)
    }
}

const  verifyEmail = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try{
        const key =  process.env.CRYPTOGRAPHY_SECRET

        const tokenBase64 = req.query.lnk;

        

        const tokenFromBase64 = Buffer.from(tokenBase64, 'base64').toString('utf8')

        const cryptoObj = JSON.parse(tokenFromBase64.trim())
        
        const plaintext = decrypt(key, cryptoObj.referer, cryptoObj.nonce, cryptoObj.tag);

        const tokenObj =   JSON.parse(plaintext)


        const ActCode = await ActivationCodes.findOne({
            where: {[Op.and]: {user_id: tokenObj.user_id}}
        })


        if(!ActCode || ActCode.activation_type !=1 || tokenObj.token != ActCode.user_token){
            throw createError.NotFound("Activation link is not valid")
        }

        let User = await Users.findOne({
            where: {id: tokenObj.user_id}
        })

        if (!User){
            throw createError.NotFound("Activation link is not valid") 
        }

        if (User.email_verified == true){
            res.redirect(req.baseUrl + '/login');
            throw createError.Forbidden("This email is already verified!")
        }

        let eventTime = getDbDateNow()

        User.email_verified = true
        User.is_active = true
        User.activated_date=eventTime
        User.user_status = 1


       const update = await Users.update(User.dataValues, {
            where: {id:tokenObj.user_id}, fields: ['email_verified', 'is_active', 'activated_date', 'user_status']
        }, {transaction})


        const userStatHistory = {
            user_id: tokenObj.user_id,
            status_id: 1,
            description: 'User activated after email verification',
            event_date: getDbDateNow()
        }

       await UserStatusHistory.create(userStatHistory, {transaction})

      await transaction.commit()

        // res.status(200).json({
        //     message: "Email verified successfully",
        // })

        res.redirect(req.baseUrl + '/login');
    }catch(err){
       await transaction.rollback()
       console.log(err)
        logData('verifyEmail: ' + err)
        next(err)
    }
}

const login = async (req, res, next) => {
    try{
        const login = await authSchema.validateAsync(req.body); 

        
       
        // Check user if exists
        let User = await Users.findOne({
            where: { user_name: login.email }
        }
        );
       // console.error('==================', User)

        if( !User){
           await logLoginAttempt(null, login.email, req.ip , false)

            throw createError.NotFound("User not registered")
        }
     

        const isMatch = await hash.isPasswordmatch(login.password, User.password)

        //const userPassword =  await hash.hashPassword(login.password)

         //logData('Login_PASS: ' + userPassword + '___Plain: ' + login.passwor + ', isMatch: ' + isMatch)

        await logLoginAttempt(User.id, login.email, req.ip , isMatch)

        const passwordRetryCount = process.env.MAXIMUM_LOGIN_ATTEMPTS

        if (!isMatch){

            //increment login attempt fails, usefull for account lock feature
          await Users.increment( {retry_count: +1}, {where: {id: User.id}})

           if(User.retry_count >=  passwordRetryCount){
            User.is_active = false
            User.user_status = 2
           await Users.update(
                User.dataValues, {where: {id:User.id}, fields:['is_active', 'user_status']}
            );
                throw createError.Forbidden('User account locked')
           }
             throw createError.Unauthorized('Username or password is not valid')
        }
            
        if (User.retry_count >= passwordRetryCount){
            throw createError.Forbidden('Account is locked too many attempts')
        }
        else if (User.email_verified != true || User.sms_verified != true){
            throw createError.Forbidden('Account is not verified')
        }else if (User.is_active != true){
            throw createError.Forbidden('Account is not active')
        }else if (User.user_status != 1){
            throw createError.Forbidden('Account is locked')
        }
        
        const userPermissions = await loadUserPermissions(User.id, User.tenant_id)

        const accessToken = await signAccessToken(User, userPermissions)
        const refreshToken = await signRefreshToken(User.id)

        //reset user login retry count
        User.retry_count = 0;
       await Users.update(
            User.dataValues, {where: {id:User.id}, fields:['retry_count']}
        );

        await logSessionData(User.id, req.ip, accessToken, refreshToken);

        let licensingInfo = await checkLicensingStatus(User.tenant_id)
        

        res.status(200).json({
            message: "Logged in successfully",
            accessToken,
            refreshToken,
            licensingInfo
        })
    } catch(error){
        logData('Login: ' + error)

        if (error.isJoi) return next(createError.BadRequest(error?.details[0]?.message ?? 'Validation error'))
        next(error)
    }
}

const checkLicensingStatus = async (tenantId) =>{

    const License = await TenantLicense.findOne({
            where: {tenant_id:tenantId}
        })

        let licensingInfo = ''
        if (License){

            const dateDiff = getDifferenceInDate( new Date, new Date(License.end_date))

            if(dateDiff > 0){
                // license is still valid
                licensingInfo = `License is active, expire on ${License.end_date}`
                const thresholdDays = process.env.LICENSE_NOTIFY_BEFORE_DAYS
                if(dateDiff < thresholdDays){
                    licensingInfo =  `You license will expire in ${thresholdDays} days`
                }
            }else{
                // License is expired
                licensingInfo = 'You license is expired, please obtain new license to proceed'
            }

        }else{
            licensingInfo ='Can not obtain your Licensing details '
        }
        return licensingInfo
        
}

const changePassword = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try{
        let login = await passUpdate.validateAsync(req.body); 

        let User = await Users.findOne({
            where: { user_name: login.email }
        }
        );

        if( !User){
            throw createError.NotFound("User not registered")
        }

        const isMatch = await hash.isPasswordmatch(login.password, User.password)

        if(!isMatch){
            throw createError.NotFound("Password did not match")
        }

        const newPassword = await hash.hashPassword(login.newPassword)

        User.password = newPassword
        User.retry_count = 0
        User.must_change_password = false

        Users.update(User.dataValues, 
            {where :{id: User.id}, 
            fields: ['password', 'retry_count', 'must_change_password']},
            {transaction}
        )

          //Log first password usage
          const passUsage = {
            user_id: User.id,
            end_date: getDbDateNow(),
            is_active: false
        
        }

        await PasswordHistory.update(
            passUsage, 
            {where:{[Op.and]: {user_id: User.id, is_active: true}}, 
            fields: ['user_id', 'end_date', 'is_active'] },
            {transaction}
        )

          //Log first password usage
          const newPassUsage = {
            user_id: User.id,
            password: newPassword,
            start_date: getDbDateNow() ,
            is_active: true
        
        }

        await PasswordHistory.create(newPassUsage,  {transaction})

       await transaction.commit()
        res.status(200).json({
            message: "Password updated successfuly!",
        })


    }catch(error){
        await transaction.rollback
        logData('changePassword: ' + error)
        next(error)
    }
}

const requestForgotPasswordWeb = async( req, res, next) => {
    try{
        let request = await emailSchema.validateAsync(req.body); 

        const Contact = await Contacts.findOne({
            where: {email: request.email}
            , include: [Users]
        })
        if(!Contact)
            throw createError.NotFound('The Email specified could not found')
        else if (Contact?.User?.email_verified != true)
            throw createError.Forbidden('The Specified email has not bee verified')

        const token = getRandomString(64)
        const activationCode = {
            user_id: Contact.User.id,
            activation_type: 4,
            user_token: token,
            expire_at: addHourDbDateNow(24)

    }

        await ActivationCodes.create(activationCode)

        
    let tokenJson = {
        user_id: userId,
        token: token
    }
    
    tokenText = JSON.stringify(tokenJson)
        
    const key =  process.env.CRYPTOGRAPHY_SECRET
    const serviceUrl = process.env.MAIL_ACTIVATION_URL
    
    const crypoData =  encryp(key, tokenText)
    
    const mailToken = {
        referer: crypoData.ciphertext,
        nonce: crypoData.iv,
        tag: crypoData.tag
    }
    
    const tokenString = JSON.stringify(mailToken)
        
    
    const tokenToBase64 = Buffer.from(tokenString).toString('base64')

    const activationLink = `${serviceUrl}?lnk=${tokenToBase64}`

    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>You have sent a request to reset your password, please find below link to reset your password</p>'
          textBody += `<p><a href="${activationLink}">Reset my password</a></p>`

    sendMail(email, textBody)

        res.status(200).json({
            message: "Email for password reset send successful",
        })
    }catch(err){
        logData('forgotPasssowrd: ' + err)
        next(error)
    }
}

const requestForgotPasswordApp = async( req, res, next) => {

    const transaction = await sequelize.transaction()
    try{
        let request = await emailSchema.validateAsync(req.body); 

        const User = await Users.findOne({
            
             include: [ 
                {
                    model: Contacts,
                    where: {email: request.email}
                }
             ]
        })

        if(!User)
            throw createError.NotFound('The Email specified could not found')
        else if (User.email_verified != true)
            throw createError.Forbidden('The Specified email has not bee verified')

        const token = getRandomNumber(8)

        const activationCode = {
            user_id: User.id,
            activation_type: 4,
            user_code: token,
            expire_at: addMinutesDbDate(10)

        }

        await ActivationCodes.destroy(
            {where: {user_id:User.id, activation_type: 4} },
            {transaction}
        )

        await ActivationCodes.create(activationCode, {transaction})

        const name = `${User.user_name}`

    let textBody =  `<p>Hi ${name}, </p>`
          textBody += '<p>You have sent a request to reset your password, bellow is your reset code; valid within 10 minutes</p>'
          textBody += `<p><b>${token}</b></p>`

    sendMail(request.email, textBody)
    await transaction.commit()
    res.status(200).json({
            message: "Email for password reset send successful, please check your email",
        })
    }catch(err){
        await transaction.rollback()
        logData('forgotPasssowrd: ' + err)
        next(err)
    }
}

const resetPassword = async(req, res, next) => {
    const transaction = await sequelize.transaction()
    try{
        let user = await passReset.validateAsync(req.body);

        const activationCode = await ActivationCodes.findOne({
            where: {user_code: user.reset_code}
        })

        if (!activationCode || activationCode.activation_type != 4){
           throw createError.NotFound('The reset code entered is not valid')
        }

        // check if reset code date is expired
        const requestTime = new Date()

        const codeCreatedAt = getJSDateFromDb( activationCode.expire_at)

        if (requestTime > codeCreatedAt){
           throw createError.Forbidden('The reset code entered already expired!')
        }

        let User = await Users.findOne({
            where: {id: activationCode.user_id}
        })

        
        if(!User){
           throw createError.NotFound('No user found with specified code')
        }


        const newPassword = await hash.hashPassword(user.newPassword)

        User.password = newPassword
        User.retry_count =1
       const updateUser =  await Users.update(
            User.dataValues, {where:{id:User.id}, fields:['password', 'retry_count']},
            {transaction}
        )


          //Log first password usage
          const passUsage = {
            user_id: User.id,
            end_date: getDbDateNow(),
            is_active: false
        
        }

        await PasswordHistory.update(
            passUsage,
             {where:{[Op.and]: {user_id: User.id, is_active: true}}, fields: ['user_id', 'end_date', 'is_active']},
             {transaction}
        )

          //Log first password usage
          const newPassUsage = {
            user_id: User.id,
            password: newPassword,
            start_date: getDbDateNow() ,
            is_active: true
        
        }

        await PasswordHistory.create(newPassUsage, {transaction})

        await transaction.commit()
        res.status(200).json({
            message: "Password updated successfuly!",
        })

    }catch(err){
        await transaction.rollback()
        logData('passwordReset: ' + err)
        next(err)
    }
}

const refresh = async (req, res, next) => {
    try{
        const { refreshToken } = req.body
        if( !refreshToken) throw createError.BadRequest()
            let userId = -1;
            try{
                 userId = await verifyRefreshToken(refreshToken)
            }catch(err){
                 throw createError.Unauthorized()
            }
       

        //Generate a pair of refresh and access tokens
        const User = await Users.findOne({
            where: {id: userId}, attributes: ['id','user_name','tenant_id'],
        })
        const userPermissions = await loadUserPermissions(userId, User.tenant_id)
        const accessToken = await signAccessToken(User, userPermissions)
        const newRefreshToken = await signRefreshToken(userId)

        let session = await ActiveSession.findOne({
            where: {[Op.and] : {user_id: userId, refresh_token: refreshToken}}
        })
        
        if (!session){
            throw createError.Unauthorized() //   return reject(createError.Unauthorized()) 
        }
        session.user_token = accessToken
        session.refresh_token = newRefreshToken
        session.user_ip = req.ip
        ActiveSession.update(session.dataValues, {where: {user_id:userId}, fields: ['user_token','refresh_token', 'user_ip']})

        let licensingInfo = checkLicensingStatus(User.tenant_id)
         res.status(200).json({accessToken, refreshToken: newRefreshToken, licensingInfo})
    }catch(error){
        console.error('REFRESH: ' + error)
         logData('REFRESH: ' + error)
        next(error)
    }
}

const logout = async (req, res, next) => {
    try{

      //  const { refreshToken } = req.body
       // if(!refreshToken) throw createError.Unauthorized()
        
       // const userId = await verifyRefreshToken(refreshToken)
       const { userId} =  req.jwtPayload;
        await destroySession(userId);

        res.sendStatus(204);

        /*
        client.DEL(userId.toString())
        .then(val => {
            res.sendStatus(204)
        })
        .catch( err => {
            logData('logout: ' + err)
            throw createError.InternalServerError()
        })
            */
    }catch(error){
        logData('logout: ' + error)
        next(error)
    }
}

const logLoginAttempt = async (userId, loginName, userIp, isSuccess) =>{

 let logData =    {
       user_id: userId,
       login_name: loginName,
       is_success: isSuccess,
       client_ip: userIp
    }

   try{
     await LoginAttempt.create(logData);
   }catch(error){
        logData('Login Attempt: ' + error);
   }
}

const logSessionData = async (userId, userIp, userToken, refreshToken) => {
    let eventTime = getDbDateNow()

  let SessionData =    { user_id: userId,
       loggin_date: eventTime,
       refresh_date: eventTime,
       user_ip: userIp,
       is_active: true,
       voluntary_logout: 0,
       user_token: userToken,
       refresh_token: refreshToken
    }

    try{
        let activeSession = await ActiveSession.findOne({
            where: {user_id: userId}
        })

        if (activeSession){
            await destroySession(userId);

            // activeSession.id = null
            // await SessionHistory.create(activeSession.dataValues)
        }

        await ActiveSession.create(SessionData)
    }catch(error){
        logData('Create Session Data: ' + error)
        throw(error)
    }
}

const destroySession = async( userId) => {

    let SessionData = await ActiveSession.findOne({
        where: { user_id: userId }
    }
    );

    if( !SessionData){
        throw createError.NotFound("Cannot logout invalid user")
    }

    let transaction;
    try {
    // start a new transaction
    transaction = await sequelize.transaction();

    // run queries, pass in transaction

    SessionData.logout_date = getDbDateNow()
    SessionData.is_active = false
    SessionData.voluntary_logout = false
    SessionData.id = null
       await SessionHistory.create(SessionData.dataValues, {transaction}),

        await ActiveSession.destroy({where: {user_id: SessionData.user_id}}, {transaction})


    await transaction.commit();

    } catch (err) {
    // if we got an error and we created the transaction, roll it back
    if (transaction) {
        await transaction.rollback();
    }
        logData('destroySession: ' + err );
        throw(err)
    }

}

const loadUserPermissions = async(userId, tenantId) => {
    try{

       

        const userPermission = await UserPermission.findAll({
            where: {user_id: userId, tenant_id: tenantId}
        })


        const groupPermission = await Group.findAll({
            where: {tenant_id: tenantId},
            include: [
                {
                    model: GroupPermission,
                    
                },
                {
                    model: UserGroup,
                    where: {user_id: userId}
                  }
            ]
        })

        let resUserPermission = []
        let resGroupPermission = []
        if (userPermission && userPermission.length > 0){
            userPermission.forEach( perm=> {
                resUserPermission.push({module: perm.module_id, permission: perm.permission_type})
            })
        }

        if (groupPermission && groupPermission.length > 0){
            groupPermission.forEach (perm => {
               let found =   resUserPermission.find( item => {
                    return item.module ==  perm.module_id
               })
               if (!found )
                    resGroupPermission.push({module: perm.module_id, permission: perm.permission_type})
            })
        }

        return resUserPermission.concat(resGroupPermission)

    }catch(err){
        logData('loadUserPermissions: ' + err)
        throw(err)
    }
}

const updateLicense = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {

        let payment = await licensePayment.validateAsync(req.body)

        const { userId, tenantId} =  req.jwtPayload;
        
        payment.tenant_id = tenantId
      

        const License = await TenantLicense.findOne({
            where: { [Op.and]: { tenant_id: tenantId} }
        });
         
        const paymentRes = await LicensePayment.create(payment, {transaction})


          // check if same package then extend date, if different then add new date
          const endDate = new Date(License.end_date)
          if (payment.package_id == License.package_id){
             if(  endDate > new Date()){
                //Extend the license
                License.end_date = addMonthsDbDateFromDate(endDate, 12)
             }else{
                License.start_date = new Date()
                License.end_date = addMonthsDbDateNow(12)
             }
          }else{
                License.package_id = payment.package_id
                License.start_date = new Date()
                License.end_date = addMonthsDbDateNow(12)
          }

            License.is_active= true
            License.payment_id = paymentRes.id
         
            await TenantLicense.update(
                payment,
                {where: {tenant_id: tenantId}},
                {transaction}
            
            )

            // create license history
            await TenantLicenseHistory.create(License, {transaction})


         await transaction.commit()
        res.status(200).json({
            ...payment,
            message: "License details updated successfuly!",
        })

       // const { userId, tenatId} =  req.jwtPayload;
        await logUserActivity(userId, 6, 2, true, group.id)

    } catch (err) {
        await transaction.rollback()

        logData('createLicenseUpdate: +' + err)
        next(err)
    }
}

module.exports = {
    register,
    login,
    changePassword,
    refresh,
    logout,
    verifyEmail,
    requestForgotPasswordWeb,
    requestForgotPasswordApp,
    resetPassword,
    updateLicense
}