const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'soft',
  description: '[👀] Ativa o efeito soft na música que esteja tocando',
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

    if (player.soft) {
      interaction.reply(`${t('commands:soft:desativo', { emoji: emojis.emojicerto })}`)
      player.soft = false
      return
    } else {
      interaction.reply(`${t('commands:soft:ativo', { emoji: emojis.emojicerto })}`)
      player.soft = true
      return
    }
  },
}
