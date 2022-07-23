const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'loop',
  description: 'Faz a música que está tocando se repetir várias vezes',
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

    let embedloopzin = new EmbedSay(interaction.member.user, t).setDescription(
      `${t('commands:loop:sucess', {
        emoji: emojis.emojicerto,
        looprepeat: player.trackRepeat
          ? `${t('commands:loop:desativoloop', { emoji: emojis.emojidesativo })}`
          : `${t('commands:loop:ativoloop', { emoji: emojis.emojiativo })}`,
        queuerepeat: player.queueRepeat ? `${t('commands:loop:loopqueuemusic')}` : '',
      })}`
    )

    if (player.queueRepeat) {
      player.setQueueRepeat(false)
    }

    player.setTrackRepeat(!player.trackRepeat)

    return interaction.reply({ embeds: [embedloopzin] })
  },
}
