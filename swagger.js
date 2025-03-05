const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require ('swagger-ui-express')
require('dotenv').config()

const PORT = process.env.PORT || 7000

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication API',
      description: 'Byteware authentication API',
      version: '1.0.0',
    license: {
        name: 'Proprietary Licenses',
        url: 'https://www.byteware.co.tz',
      },
      contact: {
        name: 'Bytware admin',
        url: 'https://www.byteware.co.tz',
      },
  },
 

  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server',
    },
  ]
  },
  // looks for configuration in specified directories
  apis: [`${__dirname}/routes/*.js`],
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app, port) {
  // Swagger Page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  // Documentation in JSON format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}

function back_swaggerDocs(app, port) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
  }

 module.exports = swaggerDocs