const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'moveme',
  description: 'Faz eu te mover para o canal de voz onde eu estou tocando',
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
    let botchannel = interaction.guild.members.me.voice.channel

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

    if (!botchannel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:moveme:notchannel', { emoji: emojis.emojierror })}`,
      })
    }

    if (botchannel.userLimit >= botchannel.members.length) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:moveme:notuserlimit', { emoji: emojis.emojierror })}`,
      })
    }

    if (botchannel.id == channelId) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:moveme:ischannel', { emoji: emojis.emojierror })}`,
      })
    }

    interaction.member.voice.setChannel(botchannel)

    return interaction.reply({
      content: `${t('commands:moveme:sucess', { emoji: emojis.emojicerto, channel: botchannel.name })}`,
    })
  },
}
