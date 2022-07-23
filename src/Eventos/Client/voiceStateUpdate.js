const emojis = require('../../Interfaces/emojis.json')
const EmbedSay = require('../../Struturas/EmbedSay')
const { PermissionsBitField, ChannelType } = require('discord.js')
let t

module.exports ={
  name: "voiceStateUpdate",
  run: async (client, oldState, newState) => {
    const player = await client.manager.players.get(oldState.guild.id)

    try {
      t = await client.getTranslate(oldState.guild.id)
    } catch (e) {
      console.error(e)
    }

    if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
      if (!player) {
        var channel = newState.member.guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildText &&
            channel.permissionsFor(newState.member.guild.members.me).has(PermissionsBitField.Flags.SendMessages)
        )
        channel.send({ content: `${t('commands:erelaevents:voicestate.desmute', { emoji: emojis.emojierror })}` })
        newState.setDeaf(true)
      } else {
        var channel = newState.member.guild.channels.cache.get(player.textChannel)
        if (channel) {
          channel.send({ content: `${t('commands:erelaevents:voicestate.desmute', { emoji: emojis.emojierror })}` })
        }
        newState.setDeaf(true)
      }
    }

    if(oldState.id === client.user.id && player && oldState.channelId && !newState.channelId) {
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
    }

    if (
      (!newState.channelId &&
        newState.member.user.id !== client.user.id &&
        player &&
        player.voiceChannel === oldState.channelId) ||
      (oldState.channelId &&
        newState.channelId &&
        oldState.channelId !== newState.channelId &&
        player &&
        player.voiceChannel === oldState.channelId &&
        newState.member.user.id !== client.user.id)
    ) {
      if (oldState.channel.members.filter((c) => !c.user.bot).size === 0) {
        player.pause(true)

        let embedbot = new EmbedSay(client.user, t).setDescription(
          `${t('commands:erelaevents:voicestate.abandonowarn', { emoji: emojis.emojicoroa })}`
        )
        client.channels.cache
          .get(player.textChannel)
          .send({ embeds: [embedbot] })
          .then((xxx) => {
            setTimeout(() => xxx.delete(), 120000)
          })

        setTimeout(() => {
          if (!player) return

          if (oldState.channel.members.filter((c) => !c.user.bot).size > 0) return

          let embedsaiu = new EmbedSay(client.user, t).setDescription(
            `${t('commands:erelaevents:voicestate.abandonoreal', { emoji: emojis.emojicoroa })}`
          )
          player.destroy()
          return client.channels.cache.get(player.textChannel).send({ embeds: [embedsaiu] })
        }, 120000)
      }
    } else if (
      newState.channel &&
      newState.channel.members.filter((c) => !c.user.bot).size === 1 &&
      player &&
      player.voiceChannel === newState.channelId
    ) {
      player.pause(false)
    }

    if (
      (!oldState.streaming && newState.streaming) ||
      (oldState.streaming && !newState.streaming) ||
      (!oldState.serverDeaf && newState.serverDeaf) ||
      (oldState.serverDeaf && !newState.serverDeaf) ||
      (!oldState.serverMute && newState.serverMute) ||
      (oldState.serverMute && !newState.serverMute) ||
      (!oldState.selfDeaf && newState.selfDeaf) ||
      (oldState.selfDeaf && !newState.selfDeaf) ||
      (!oldState.selfMute && newState.selfMute) ||
      (oldState.selfMute && !newState.selfMute) ||
      (!oldState.selfVideo && newState.selfVideo) ||
      (oldState.selfVideo && !newState.selfVideo)
    )
      if (!oldState.channelId && newState.channelId) {
        if (newState.channel.type == ChannelType.GuildStageVoice && newState.guild.members.me.voice.suppress) {
          try {
            await newState.guild.me.voice.setSuppressed(false)
          } catch (e) {
            console.log(String(e).grey)
          }
        }
        return
      }
    if (oldState.channelId && !newState.channelId) {
      return
    }
    if (oldState.channelId && newState.channelId) {
      if (newState.channel.type == ChannelType.GuildStageVoice && newState.guild.members.me.voice.suppress) {
        try {
          await newState.guild.members.me.voice.setSuppressed(false)
        } catch (e) {
          console.log(String(e).grey)
        }
      }
      return
    }
  }
}
