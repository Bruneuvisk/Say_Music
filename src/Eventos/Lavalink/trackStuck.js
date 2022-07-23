const EmbedSay = require('../../Struturas/EmbedSay')
const emojis = require('../../Interfaces/emojis.json')
const prettyMilliseconds = require('pretty-ms')
let t

module.exports = async (client, player, track, payload) => {
    try {
        t = await client.getTranslate(player.guild)
      } catch (e) {
        console.error(e)
      }

      player.stop()
      client.channels.cache
        .get(player.textChannel)
        .send(`${t('commands:erelaevents:trackstuck.message', { emoji: emojis.emojierror, music: track.title })}`)
}