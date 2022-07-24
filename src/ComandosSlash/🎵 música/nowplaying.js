const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar } = require('../../Struturas/Functions')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'nowplaying',
  description: '[🎵] Exibe informações da música que está sendo tocada atualmente',
  cooldown: 5,
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

    let player = await client.manager.players.get(interaction.guild.id)
    const { channel } = interaction.member.voice;

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

    if (!player.queue.current) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:nowplaying:errornotcurrent', { emoji: emojis.emojierror })}`,
      })
    }

    let embednowplaying = new EmbedSay(interaction.member.user, t)
      .setAuthor({ name: `${t('commands:nowplaying:embed.author')}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
      .setTitle(`${emojis.emojicerto} | **${player.queue.current.title}**`)
      .setURL(player.queue.current.uri)
      .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .addFields([
        {
          name: `${t('commands:nowplaying:embed.filed1name', { emoji: emojis.emojisetinha })}`,
          value: `\`${prettyMilliseconds(player.queue.current.duration, { colonNotation: true })}\``,
          inline: true,
        },
        {
          name: `${t('commands:nowplaying:embed.filed2name', { emoji: emojis.emojisetinha })}`,
          value: `\`${player.queue.current.author}\``,
          inline: true,
        },
        {
          name: `${t('commands:nowplaying:embed.filed3name', { emoji: emojis.emojisetinha })}`,
          value: `\`${player.queue.length}\``,
          inline: true,
        },
        {
          name: `${t('commands:nowplaying:embed.filed4name', { emoji: emojis.emojisetinha })}`,
          value: `${createBar(player)}`,
          inline: false,
        }
      ])
    return interaction.reply({ embeds: [embednowplaying] })
  },
}
