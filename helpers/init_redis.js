const redis = require('redis')
const dotenv = require("dotenv")
dotenv.config()

const redisConfig = { socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
}

}

const client = redis.createClient(redisConfig)

client.on('connect', ()=>{
    console.log("client connected to redis")
})

client.on('ready', ()=> {
    console.log('client connected to redis and ready to use...')
})

client.on('error', err =>{
    console.log('onerror',err) 
})

client.on('end', ()=> {
    console.log("Client disconnected from redis")
})

client.on('SIGINT', () => {
    client.quit()
})

 client.connect()

 





module.exports = client 



