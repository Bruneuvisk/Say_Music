const config = require('../../Interfaces/config.json')
const emojis = require('../../Interfaces/emojis.json')
const { EmbedBuilder } = require('discord.js')
const filterregions = {
  'en-US': '🇺🇸 | Estados Unidos',
  'en-GB': '🏴󠁧󠁢󠁥󠁮󠁧󠁿 | Inglaterra',
  'zh-CN': '🇨🇳 | China',
  'zh-TW': '🇨🇳 | China',
  cs: '🇨🇿 | Chéquia',
  da: '🇩🇰 | Dinamarca',
  nl: '🇳🇱 | Paises Baixos',
  fr: '🇫🇷 | França',
  de: '🇩🇪 | Alemanha',
  el: '🇬🇷 | Grécia',
  hu: '🇭🇺 | Hungria',
  it: '🇮🇹 | Itália',
  ja: '🇯🇵 | Japão',
  ko: '🇰🇷 | Corea do Sul',
  no: '🇳🇴 | Noruega',
  pl: '🇵🇱 | Polonia',
  'pt-BR': '🇧🇷 | Brasil',
  ru: '🇷🇺 | Russia',
  'es-ES': '🇪🇸 | Espanha',
  'sv-SE': '🇸🇪 | Suécia',
  tr: '🇹🇷 | Turquia',
  bg: '🇧🇬 | Bulgária',
  uk: '🇺🇦 | Ucrânia',
  fi: '🇫🇮 | Finlândia',
  hr: '🇭🇷 | Croácia',
  ro: '🇷🇴 | Roménia',
  lt: '🇱🇹 | Lituânia',
}

module.exports ={
  name: "guildDelete",
  run: async (client, guild) => {
    const server = await client.database.servidores.findOne({
      idServer: guild.id,
    })

    if (server) {
      await server.deleteOne()
    }

    let owner = await client.users.fetch(guild.ownerId)

    let embedentrou = new EmbedBuilder()
      .setTitle(`${emojis.emojisay} **Servidor removido!** ${emojis.emojisay}`)
      .setDescription(
        `**\`📜\` Dados do servidor** \n\n \`🔌\` __Nome Do Servidor__: ${guild.name} \n \`👑\` __Dono do Servidor__: <@${
          guild.ownerId
        }>/${owner.tag}/\`${owner.id}\` \n \`🌐\` __Região do Servidor__: ${
          filterregions[guild.preferredLocale]
        } \n \`👥\` __Membros do Servidor__: ${guild.memberCount} \n \`🆔\` __ID do Servidor__: ${
          guild.id
        } \n \`🕋\` __Total de Canais__: ${guild.channels.cache.size}`
      )
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor(config.color)
    let canalEnviar = client.guilds.cache.get('837089132206489602').channels.cache.get('982422427248259172')
    canalEnviar.send({ embeds: [embedentrou] }).catch((error) => console.log('Promises rejected: ' + error))

    var player = client.manager.players.get(guild.id)
    if (!player) return
    if (guild.id == player.guild) {
      player.destroy()
    }
  }
}
