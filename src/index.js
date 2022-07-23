const { SayMusic } = require('./Struturas/Client')
const client = new SayMusic()
const { startMongoose } = require('./Database/mongoose')

startMongoose(client)
require("../src/Handlers/commands")(client)
require("../src/Handlers/events")(client)
require("../src/Handlers/slashCommand")(client)

client.connect()

process.on('unhandledRejection', (error) => {
  if (error == 'DiscordAPIError: Missing Permissions') return null

  console.error('Unhandled promise rejection:', error)
})

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});


module.exports = client;
