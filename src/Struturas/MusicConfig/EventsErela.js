const EmbedSay = require('../EmbedSay')
const emojis = require('../../Interfaces/emojis.json')
const prettyMilliseconds = require('pretty-ms')
let t

module.exports = async (client) => {
  client.manager
    .on('playerCreate', async (player) => {
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
            guild.me.voice.setDeaf(true)
            i = 10
          }, 1000)
        })
      }
    })
    .on('playerMove', async (player, oldChannel, newChannel) => {
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
    })
    .on('trackStart', async (player, track) => {
      try {
        t = await client.getTranslate(player.guild)
      } catch (e) {
        console.error(e)
      }

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
      let NowPlaying = await client.channels.cache.get(player.textChannel).send({ embeds: [TrackStartedEmbed] })
      player.setNowplayingMessage(NowPlaying)
    })
    .on('trackStuck', async (player, track, payload) => {
      try {
        t = await client.getTranslate(player.guild)
      } catch (e) {
        console.error(e)
      }

      player.stop()
      client.channels.cache
        .get(player.textChannel)
        .send(`${t('commands:erelaevents:trackstuck.message', { emoji: emojis.emojierror, music: track.title })}`)
    })
    .on('trackError', async (player, track, payload) => {
      try {
        t = await client.getTranslate(player.guild)
      } catch (e) {
        console.error(e)
      }

      player.stop()
      client.channels.cache
        .get(player.textChannel)
        .send(`${t('commands:erelaevents:trackerror.message', { emoji: emojis.emojierror, music: track.title })}`)
    })
    .on('queueEnd', async (player) => {
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
    })
}
