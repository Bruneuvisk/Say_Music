const Client = require('../../Database/Schemas/Client')
const Guild = require('../../Database/Schemas/Guild')
const Queue = require('../../Database/Schemas/Queue')
const fetch = require("node-fetch")
const config = require("../../Interfaces/config.json")
const { ActivityType } = require("discord.js")

module.exports ={
  name: "ready",
  run: async (client) => {
    const ping = new Date()
    ping.setHours(ping.getHours() - 3)

    client.database.servidores = Guild
    client.database.cliente = Client
    client.database.queue = Queue

    client.manager.init(client.user.id)

    let status = [
      { name: `👥 ${client.users.cache.size} amiguinhos que tenho`, type: ActivityType.Watching },
      { name: `🔗 discord.gg/xpYSzpJ8rK servidor de suporte`, type: ActivityType.Playing },
      { name: '🇧🇷 Sou um bot trilíngue mais fui feito por brasileiros', type: ActivityType.Watching },
      { name: '🎵 Estou aqui para alegrar seus ouvidos com minha músicas', type: ActivityType.Streaming },
      { name: `📯 Altas músicas para te deixar mais feliz`, type: ActivityType.Listening },
      { name: `🔮 Para ter acesso aos meus comandos use /help`, type: ActivityType.Watching },
      { name: `🚀 Sou totalmente feita em comandos de (/)`, type: ActivityType.Watching },
      { name: `👥 ${client.users.cache.size} amigos que tengo`, type: ActivityType.Watching },
      { name: `🔗 discord.gg/xpYSzpJ8rK servidor de apoyo`, type: ActivityType.Playing },
      { name: '🇧🇷 Soy un bot trilingüe pero fui hecho por brasileños', type: ActivityType.Watching },
      { name: '🎵 Estoy aquí para animar tus oídos con mi música', type: ActivityType.Streaming },
      { name: `📯 Grandes canciones para hacerte más feliz`, type: ActivityType.Listening },
      { name: `🔮 Para acceder a mis comandos utilice /help`, type: ActivityType.Watching },
      { name: `🚀 Estoy totalmente hecho al mando de (/)`, type: ActivityType.Watching },
      { name: `👥 ${client.users.cache.size} friends I have`, type: ActivityType.Watching },
      { name: `🔗 discord.gg/xpYSzpJ8rK support server`, type: ActivityType.Playing },
      { name: '🇧🇷 I am a trilingual bot but I was made by Brazilians', type: ActivityType.Watching },
      { name: '🎵 I am here to delight your ears with my music', type: ActivityType.Streaming },
      { name: `📯 Great songs to make you happier`, type: ActivityType.Listening },
      { name: `🔮 To get access to my commands use /help`, type: ActivityType.Watching },
      { name: `🚀 I am totally done with (/) commands`, type: ActivityType.Watching },
    ]

    function setStatus() {
      let randomStatus = status[Math.floor(Math.random() * status.length)]
      client.user.setPresence({ activities: [randomStatus], status: 'dnd' })
    }

    setStatus()
    setInterval(() => setStatus(), 20000)
    client.logger.log(`${client.user.username} online!`, "ready");
    client.logger.log(`o Bot ${client.user.tag} foi inicializada em ${client.guilds.cache.size} servidores e com um total de ${client.users.cache.size} usuários me ouvindo!`, "ready");

    /*await fetch(`https://api.voidbots.net/bot/stats/${client.user.id}`, {
      method: "POST",
      headers: { 
        Authorization: config.tokenvoid,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({"server_count": client.guilds.cache.size })
    }).then(response => response.text())
    .then(console.log).catch(console.error);*/
  }
}
