const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'removetrack',
  description: '[🎵] Remove uma música da sua fila de músicas',
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
      name: "numero_musica",
      description: "Qual música deseja remover da sua fila?",
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

    const numberMusic = options.getInteger('numero_musica')

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

    if (Number(numberMusic) > player.queue.size) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:removetrack:errornot', { emoji: emojis.emojierror })}`,
      })
    }

    player.queue.remove(Number(numberMusic) - 1)

    return interaction.reply({
      content: `${t('commands:removetrack:sucess', { emoji: emojis.emojicerto, music: numberMusic })}`,
    })
  },
}
