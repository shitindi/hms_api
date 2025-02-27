const { error } = require('@hapi/joi/lib/base')
const bcrypt = require('bcrypt')

const hashPassword = async (password) =>{

    try{
        //Format of hash data is $[algorithm]$[cost][hash]
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    }catch{error}{
        throw error
    }
}

const isPasswordmatch = async (sentPassword, savedPassword) => {
    try{
        return await bcrypt.compare(sentPassword, savedPassword)
    }catch(error){
        throw error
    }
}

module.exports = {
    hashPassword,
    isPasswordmatch
}