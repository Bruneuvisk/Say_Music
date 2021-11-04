const mongoose = require('mongoose')
const c = require('colors')
const config = require('../Interfaces/config.json')

module.exports = {
  startMongoose() {
    try {
      mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })

      console.log(c.green('[DataBase] - Conectado ao Banco de Dados Mongoose.'))
    } catch (err) {
      if (err) return consola.error(c.bgRed(`[DataBase] - ERROR: ${err}`))
    }
  },
}
