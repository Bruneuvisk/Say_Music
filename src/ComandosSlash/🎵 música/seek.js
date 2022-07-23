const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar } = require('../../Struturas/Functions')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'seek',
  description: 'Altera a posição da música que está sendo tocada em segundos',
  cooldown: 5,
  memberperm: ['SendMessages', 'UseApplicationCommands'],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      name: "tempo_segundos",
      description: "Quanto tempo em segundos deseja mudar a música?",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
  ],
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

    const timeSecond = options.getInteger('tempo_segundos')

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

    if (Number(timeSecond) < 0 || Number(timeSecond) >= player.queue.current.duration / 1000) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:seek:error', { emoji: emojis.emojierror, duration: player.queue.current.duration })}`,
      })
    }

    player.seek(Number(timeSecond) * 1000)

    let embedseek = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:seek:embed.title', {
          emoji: emojis.emojicerto,
          time: prettyMilliseconds(Number(timeSecond) * 1000, { colonNotation: true }),
        })}`
      )
      .setDescription(`${t('commands:seek:embed.desc', { emoji: emojis.emojisetinha, bar: createBar(player) })}`)

    return interaction.reply({ embeds: [embedseek] })
  },
}
