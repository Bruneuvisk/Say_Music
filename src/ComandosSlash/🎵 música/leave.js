const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'leave',
  description: '[🎵] Faz eu sair do canal de voz me desconectando',
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

    interaction.guild.members.me.voice.disconnect()
    player.destroy()

    return interaction.reply({ content: `${t('commands:leave:sucess', { emoji: emojis.emojicerto })}` })
  },
}
