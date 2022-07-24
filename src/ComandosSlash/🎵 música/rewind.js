const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'rewind',
  description: '[🎵] Procura uma quantidade específica de segundos para trás, para voltar a sua música',
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
      description: "Quanto tempo em segundos deseja voltar a música?",
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

    let seektime = player.position - Number(timeSecond) * 1000
    if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
      seektime = 0
    }

    player.seek(Number(seektime))

    return interaction.reply({
      content: `${t('commands:rewind:sucess', {
        emoji: emojis.emojicerto,
        time: seektime,
        duration: prettyMilliseconds(player.position, { colonNotation: true }),
      })}`,
    })
  },
}
