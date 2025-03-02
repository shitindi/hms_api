const nodemailer = require('nodemailer')
const {logData} = require('./logger')

const sendMail = async (recEmail, textBody) => {

    try{

    const host = process.env.MAIL_OUTGOING_HOST
    const port = process.env.MAIL_OUTGOING_PORT
    const sender = process.env.MAIL_USER
    const password = process.env.MAIL_SECRET

    const subject = "Your Account Activation"
    const senderName = "Byteware Accounts "

    const serverConfig = {
        host: host,
        port: port,
        secure: true,
        auth: {
            user: sender,
            pass: password
        }
    }

    console.log('ServerConfig: ', serverConfig)

    const transporter = nodemailer.createTransport(serverConfig);

    //send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"${senderName}" <${sender}>`,   // sender address
        to: recEmail,               // comma separated list of email
        subject: subject,
        html: textBody

    })
}catch(error){
    console.log('sendMail: ', error)
    logData('SendMail: ' + error)
}

}

module.exports = {
    sendMail
}