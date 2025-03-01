const crypto = require('crypto')

const getRandomString = (len = 64) => {
    return  crypto.randomBytes(len).toString('base64')
}

const getRandomNumber = (len = 6) => {
     if (len <1)
        len = 2
     else if (len > 10)
        len = 11

     len -=1;

     const base = 10 ** len;
     //console.log('Base: ', base, 'len: ', len)
     
    return Math.floor(base + Math.random() * 9 * base)
}


module.exports = {
    getRandomString,
    getRandomNumber
}