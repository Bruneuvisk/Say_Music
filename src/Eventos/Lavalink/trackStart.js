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

    let guild = client.guilds.cache.get(player.guild)

    let channel = guild.channels.cache.get(player.textChannel);

    let TrackStartedEmbed = new EmbedSay(client.user, t)
        .setTitle(`${t('commands:erelaevents:trackstart.title', { emoji: emojis.emojicoroa, track: track.title })}`)
        .setURL(track.uri)
        .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:erelaevents:trackstart.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: track.author,
            emojise: emojis.emojisetinha,
            format: prettyMilliseconds(track.duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.length || `${t('commands:erelaevents:trackstart.errorde')}`,
            emojiseta: emojis.emojisetinha,
            membro: track.requester.id,
            coroa: emojis.emojicoroa,
          })}`
        )
    const m = await channel.send({ embeds: [TrackStartedEmbed] });
    
    await player.setNowplayingMessage(m);
}