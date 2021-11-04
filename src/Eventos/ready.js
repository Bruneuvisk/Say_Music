const c = require('colors')
const Client = require('../Database/Schemas/Client')
const Guild = require('../Database/Schemas/Guild')
const Queue = require('../Database/Schemas/Queue')

module.exports = async (client) => {
  const ping = new Date()
  ping.setHours(ping.getHours() - 3)

  client.database.servidores = Guild
  client.database.cliente = Client
  client.database.queue = Queue

  client.manager.init(client.user.id)

  let status = [
    { name: `👥 ${client.users.cache.size} amiguinhos que tenho`, type: 'WATCHING' },
    { name: `🔗 discord.gg/xpYSzpJ8rK servidor de suporte`, type: 'PLAYING' },
    { name: '🇧🇷 Sou um bot trilíngue mais fui feito por brasileiros', type: 'WATCHING' },
    { name: '🎵 Estou aqui para alegrar seus ouvidos com minha músicas', type: 'STREAMING' },
    { name: `📯 Altas músicas para te deixar mais feliz`, type: 'LISTENING' },
    { name: `⚙️ Sou irmãnzinha mais nova dos meus irmãos hércules`, type: 'WATCHING' },
    { name: `🔮 Para ter acesso aos meus comandos use /info help`, type: 'WATCHING' },
    { name: `🚀 Sou totalmente feita em comandos de /`, type: 'WATCHING' },
    { name: `👥 ${client.users.cache.size} amigos que tengo`, type: 'WATCHING' },
    { name: `🔗 discord.gg/xpYSzpJ8rK servidor de apoyo`, type: 'PLAYING' },
    { name: '🇧🇷 Soy un bot trilingüe pero fui hecho por brasileños', type: 'WATCHING' },
    { name: '🎵 Estoy aquí para animar tus oídos con mi música', type: 'STREAMING' },
    { name: `📯 Grandes canciones para hacerte más feliz`, type: 'LISTENING' },
    { name: `⚙️ Soy la hermana pequeña de mis hermanos Hércules`, type: 'WATCHING' },
    { name: `🔮 Para acceder a mis comandos utilice /info help`, type: 'WATCHING' },
    { name: `🚀 Estoy totalmente hecho al mando de /`, type: 'WATCHING' },
    { name: `👥 ${client.users.cache.size} friends I have`, type: 'WATCHING' },
    { name: `🔗 discord.gg/xpYSzpJ8rK support server`, type: 'PLAYING' },
    { name: '🇧🇷 I am a trilingual bot but I was made by Brazilians', type: 'WATCHING' },
    { name: '🎵 I am here to delight your ears with my music', type: 'STREAMING' },
    { name: `📯 Great songs to make you happier`, type: 'LISTENING' },
    { name: `⚙️ I am the little sister of my brothers Hercules`, type: 'WATCHING' },
    { name: `🔮 To get access to my commands use /info help`, type: 'WATCHING' },
    { name: `🚀 I am totally done with / commands`, type: 'WATCHING' },
  ]

  function setStatus() {
    let randomStatus = status[Math.floor(Math.random() * status.length)]
    client.user.setPresence({ activities: [randomStatus] })
  }

  setStatus()
  setInterval(() => setStatus(), 20000)
  console.log(
    c.bgMagenta(
      `[LOGIN] - O Bot ${client.user.tag} foi inicializada em ${client.guilds.cache.size} servidores e ${client.users.cache.size} usuários me ouvindo!`
    )
  )
}
