const EmbedSay = require('../../Struturas/EmbedSay')
const emojis = require('../../Interfaces/emojis.json')
const prettyMilliseconds = require('pretty-ms')
let t


const { Player } = require("erela.js");
    /**
     * 
     * @param {Player} player 
     * @param {String} oldChannel
     * @param {String} newChannel
     */
module.exports = async (client, player, oldChannel, newChannel) => {
    try {
      t = await client.getTranslate(player.guild)
    } catch (e) {
      console.error(e)
    }

    if (!newChannel) {
        let embeddisconnect = new EmbedSay(client.user, t)
          .setTitle(`${t('commands:erelaevents:playermove.title', { emoji: emojis.emojicoroa })}`)
          .setDescription(
            `${t('commands:erelaevents:playermove.desc', {
              emoji: emojis.emojisetinha,
              channel: client.channels.cache.get(player.voiceChannel).name,
            })}`
          )
        client.channels.cache.get(player.textChannel).send({ embeds: [embeddisconnect] })
        player.destroy()
    } else {
        player.voiceChannel = newChannel
        if (player.paused) return
        setTimeout(() => {
          player.pause(true)
          setTimeout(() => player.pause(false), client.ws.ping * 2)
        }, client.ws.ping * 2)
    }
}