const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'grab',
  description: '[🎵] Salva a música que está sendo tocada na suas mensagens diretas no discord',
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

    let embedauthor = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:grab:embed.title', { emoji: emojis.emojipasta })}`)
      .setAuthor(`${player.queue.current.title}`)
      .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
      .setURL(player.queue.current.uri)
      .setDescription(
        `${t('commands:grab:embed.desc', {
          emoji: emojis.emojicerto,
          duration: prettyMilliseconds(player.queue.current.duration, { colonNotation: true }),
          autor: player.queue.current.author,
          uri: player.queue.current.uri,
          channelid: interaction.channel.id,
        })}`
      )

    interaction.member.send({ embeds: [embedauthor] }).catch((e) => {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:grab:errormessage', { emoji: emojis.emojierror })}`,
      })
    })

    return interaction.reply(`${t('commands:grab:sucess', { emoji: emojis.emojicerto })}`)
  },
}
