const {encryptSymmetric: encryp, decryptSymmetric: decrypt} = require('./helpers/cryptography')
const {getRandomNumber, getRandomString} = require('./helpers/code_generator')
const {sendMail} = require('./helpers/mailing')
require('dotenv').config()

const runSymmetryCrypto = () =>
{

let textJson = {
    user_id: 128,
    token: 'zn580nnSgGxKe+tWMc84a0LizV3xkLZ/IYxB/6xp9FL4OMQlcd4pATSJeXzvYnVYe1jfpS7nfeg='
}

text = JSON.stringify(textJson)

console.log('Stringfied ojb: ', text)

key =  "mbjWfrXqFz5MIslH37XdCAG8iGSbqLkz"

const crypoData =  encryp(key, text)

const mailToken = {
    referer: crypoData.ciphertext,
    nonce: crypoData.iv,
    tag: crypoData.tag
}

const tokenString = JSON.stringify(mailToken)

console.log('token stry: ', tokenString);


const tokenToBase64 = Buffer.from(tokenString).toString('base64')

console.log('Token base64: ', tokenToBase64)

 const tokenFromBase64 = Buffer.from(tokenToBase64, 'base64').toString('ascii')



console.log("Encrypted data: ", tokenFromBase64)

 const cryptoObj = JSON.parse(tokenFromBase64)

 console.log('Crypto object: ', cryptoObj)

 const plaintext = decrypt(key, cryptoObj.referer, cryptoObj.nonce, cryptoObj.tag);

 console.log("Plain Data: ", plaintext)

 console.log('plain text obj: ', JSON.parse(plaintext))

}

const testRandomGen = () => {
    let randString = getRandomString(64);
    let randNumber = getRandomNumber(6);

    console.log('Random String: ', randString);

    console.log('Random Number: ', randNumber)
}

//testRandomGen();

sendMail('ndinao@hotmail.com', 'Ndinao Shitindi', 'https://www.byteware.co.tz')