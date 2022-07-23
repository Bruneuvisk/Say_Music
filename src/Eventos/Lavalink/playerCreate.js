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

    player.setVolume(50)

    let embedinico = new EmbedSay(client.user, t)
        .setTitle(
          `${t('commands:erelaevents:playercreate.title', {
            emoji: emojis.emojicoroa,
            channel: client.channels.cache.get(player.voiceChannel).name,
          })}`
        )
        .setDescription(
          `${t('commands:erelaevents:playercreate.desc', {
            emoji: emojis.emojisetinha,
            channel: client.channels.cache.get(player.textChannel).id,
          })}`
        )
    client.channels.cache.get(player.textChannel).send({ embeds: [embedinico] })

    for (var i = 0; i <= 5; i++) {
        await new Promise((res) => {
          setTimeout(() => {
            res(2)
            var guild = client.guilds.cache.get(player.guild)
            guild.members.me.voice.setDeaf(true)
            i = 10
          }, 1000)
        })
    }
}