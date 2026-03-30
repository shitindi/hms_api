const crypto = require('crypto');
const {logData} = require('./logger')


const encryptSymmetric= (key, plaintext) =>{
    try{
    const iv = crypto.randomBytes(12).toString('base64');

    const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(key, 'utf8'),
        Buffer.from(iv, 'base64')
    );
    
    let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
 //console.log('ciphertext 1: ', ciphertext)

 
    ciphertext +=cipher.final('base64');
    const tag = cipher.getAuthTag();
     // console.log('ciphertext: ', ciphertext)
    return {ciphertext, iv, tag}
    }catch(err){
        console.log('encryptSymmetric: ', err)
        logData('encryptSymmetric: ' + err)
        return null
    }
}

const decryptSymmetric = (key, ciphertext, iv, tag) =>{
   try{


    const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            Buffer.from(key, 'utf8'),
            Buffer.from(iv, 'base64')
        );

        decipher.setAuthTag(Buffer.from(tag, 'base64'));

        let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
        plaintext += decipher.final('utf8');

        return plaintext;
    }catch(err){
        logData('decryptSymmetric: ' + err)
        return null
    }
}

module.exports = {
    encryptSymmetric,
    decryptSymmetric
}

