const emojis = require('../Interfaces/emojis.json')
const EmbedSay = require('../Struturas/EmbedSay')
let t

module.exports = async (client, channel) => {
  await deleteChannel(client, channel)

  try {
    t = await client.getTranslate(channel.guild.id)
  } catch (e) {
    console.error(e)
  }

  if (channel.type === 'GUILD_VOICE') {
    if (channel.members.has(client.user.id)) {
      var player = client.manager.players.get(channel.guild.id)
      if (!player) return
      if (channel.id === player.voiceChannel) {
        let embedsave = new EmbedSay(client.user, t)
          .setTitle(`${t('commands:erelaevents:channeldelete.title', { emoji: emojis.emojicoroa })}`)
          .setDescription(`${t('commands:erelaevents:channeldelete.desc', { emoji: emojis.emojicerto })}`)
        client.channels.cache.get(player.textChannel).send({ embeds: [embedsave] })
        player.destroy()

        if (channel.guild.me.voice.channel) {
          channel.guild.me.voice.disconnect()
        }
      }
    }
  }
}

async function deleteChannel(client, channel) {
  const guild = channel.guild

  const server = await client.database.servidores.findOne({
    idServer: guild.id,
  })

  if (!server) return

  const channelsblock = server.cmdblock.channels

  if (channelsblock.includes(channel.id)) {
    await client.database.servidores.findOneAndUpdate(
      { idServer: guild.id },
      { $pull: { 'cmdblock.channels': channel.id } }
    )
  }
}
