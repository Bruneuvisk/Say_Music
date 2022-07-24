const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar, paginateItens } = require('../../Struturas/Functions')
const _ = require('lodash')
const { format } = require('../../Struturas/Functions')

module.exports = {
  name: 'queue',
  description: '[🎵] Lista a fila de músicas atual no servidor',
  cooldown: 15,
  memberperm: ['SendMessages', 'UseApplicationCommands'],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    const {
      member,
      channelId,
      guildId,
      applicationId,
      commandName,
      deferred,
      replied,
      ephemeral,
      options,
      id,
      createdTimestamp,
    } = interaction
    const { guild } = member
    const { channel } = interaction.member.voice;

    let player = await client.manager.players.get(interaction.guild.id)

    if (!player) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notocad', { emoji: emojis.emojierror })}`,
      })
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (
      player && channel.id !== player.voiceChannel
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:queue:embedinicio.title', { emoji: emojis.emojicoroa })}`)
        .setDescription(
          `${t('commands:queue:embedinicio.desc', {
            emoji: emojis.emojicerto,
            emojiseta: emojis.emojisetinha,
            titleplayer: player.queue.current.title,
            uriplayer: player.queue.current.uri,
            requester: player.queue.current.requester,
            bar: createBar(player),
          })}`
        )
      return interaction.reply({ embeds: [QueueEmbed] })
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index
      return t
    })

    let ChunkedSongs = _.chunk(Songs, 10)

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (te) =>
          `\`${te.index + 1}.\` [${te.title}](${te.uri}) \n \`${format(te.duration)}\`${t('commands:queue:filearray')}${
            te.requester
          }\n`
      ).join('\n')

      let Embed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:queue:embedinicio.title', { emoji: emojis.emojicoroa })}`)
        .setDescription(
          `${t('commands:queue:embedinicio.desc2', {
            emoji: emojis.emojicerto,
            emojiseta: emojis.emojisetinha,
            titleplayer: player.queue.current.title,
            uriplayer: player.queue.current.uri,
            description: SongsDescription,
            sizequeue: player.queue.totalSize - 1,
            duration: format(player.queue.duration),
            requester: player.queue.current.requester,
            bar: createBar(player),
          })}`
        )
      return Embed
    })

    if (!Pages.length || Pages.length === 1) return interaction.reply({ embeds: [Pages[0]] })
    else paginateItens(interaction, Pages)
  },
}
