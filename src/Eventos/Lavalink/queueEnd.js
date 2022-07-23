const EmbedSay = require('../../Struturas/EmbedSay')
const emojis = require('../../Interfaces/emojis.json')
const prettyMilliseconds = require('pretty-ms')
let t

module.exports = async (client, player) => {
    try {
        t = await client.getTranslate(player.guild)
    } catch (e) {
        console.error(e)
    }

    let QueueEmbed = new EmbedSay(client.user, t)
        .setTitle(`${t('commands:erelaevents:queueend.title', { emoji: emojis.emojicoroa })}`)
        .setDescription(
          `${t('commands:erelaevents:queueend.desc', {
            emoji: emojis.emojisetinha,
            channel: client.channels.cache.get(player.voiceChannel)
              ? client.channels.cache.get(player.voiceChannel).name
              : `${t('commands:erelaevents:queueend.error')}`,
          })}`
        )
    client.channels.cache.get(player.textChannel).send({ embeds: [QueueEmbed] })
    player.destroy()
}