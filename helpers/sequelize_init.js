const {Sequelize, DataTypes} = require('sequelize')
require('dotenv').config()


const [host, port, db, user, secret] = [
    process.env.MYSQL_HOST, process.env.MYSQL_PORT, process.env.MYSQL_DB, process.env.MYSQL_USER, process.env.MYSQL_SECRET
]

const sequelize = new Sequelize(db, user, secret, {
    host: host,port: port,dialect: 'mysql',
    define: {
      //  freezeTableName: true  // make global options instead of individual definition
    }
}
);

module.exports = {
    sequelize,
    DataTypes
}