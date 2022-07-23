const mongoose = require('mongoose')
const c = require('colors')
const config = require('../Interfaces/config.json')

module.exports = {
  startMongoose(client) {
    try {
      mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      
      client.logger.log(`Conectado ao Banco de Dados Mongoose.`, "log")
    } catch (err) {
      if (err) return consola.error(c.bgRed(`[DataBase] - ERROR: ${err}`))
    }
  },
}
