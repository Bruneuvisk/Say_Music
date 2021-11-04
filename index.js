const { SayMusic } = require('./src/Struturas/Client')
const client = new SayMusic()
const { sep } = require('path')
const fs = require('fs')
const c = require('colors')
const { startMongoose } = require('./src/Database/mongoose')

const loadEvents = (dir = './src/Eventos/') => {
  fs.readdir(dir, (err, files) => {
    if (err) return console.error(err)
    files.forEach((file) => {
      const event = require(`${dir}${file}`)
      let eventName = file.split('.')[0]
      client.on(eventName, event.bind(null, client))
      console.log(c.bold(`[EVENTOS] - O Evento ${eventName} foi carregado com sucesso;`))
    })
  })
}

const loadCommands = (dir = './src/Comandos/') => {
  fs.readdirSync(dir).forEach((dirs) => {
    const commandFiles = fs.readdirSync(`${dir}${sep}${dirs}${sep}`).filter((files) => files.endsWith('.js'))
    for (const file of commandFiles) {
      const command = require(`${dir}/${dirs}/${file}`)
      client.commands.set(command.name, command)
      console.log(c.blue(`[COMANDOS] - O comando ${command.name} foi carregado com sucesso;`))
    }
  })
}

process.on('unhandledRejection', (error) => {
  if (error == 'DiscordAPIError: Missing Permissions') return null

  console.error('Unhandled promise rejection:', error)
})

loadEvents()
loadCommands()
startMongoose()
require('./src/Struturas/SlashHandler')(client)
require('./src/Struturas/MusicConfig/CreateMusic')(client)
require('./src/Struturas/Botlist/VoidBots')(client)

client.login()
