const {Sequelize, DataTypes} = require('sequelize')
require('dotenv').config()


const [host, port, db, user, secret] = [
    process.env.PGD_HOST, process.env.PGD_PORT, process.env.PGD_DB, process.env.PGD_USER, process.env.PGD_SECRET
]

const sequelize = new Sequelize(db, user, secret, {
    host: host,port: port,dialect: 'postgres',
    define: {
      //  freezeTableName: true  // make global options instead of individual definition
    }
}
);

module.exports = {
    sequelize,
    DataTypes
}