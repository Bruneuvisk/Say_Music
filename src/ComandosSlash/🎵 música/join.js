const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'join',
  description: 'Faz eu entrar num canal de voz para tocar músicas pra você',
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

    var { channel } = interaction.member.voice
    if (!channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    var player = client.manager.players.get(interaction.guild.id)
    if (player) {
      var vc = player.voiceChannel
      var voiceChannel = interaction.guild.channels.cache.get(player.voiceChannel)

      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:join:errornotcall', {
          emoji: emojis.emojierror,
          voice: vc ? (voiceChannel ? voiceChannel.name : vc) : `${t('commands:join:errornot')}`,
        })}`,
      })
    }

    player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      selfDeafen: true,
    })

    if (player.state !== 'CONNECTED') {
      player.connect()
      player.stop()

      interaction.reply({
        ephemeral: true,
        content: `${t('commands:join:sucess', { emoji: emojis.emojicerto, channel: channel })}`,
      })
    } else {
      var vc = player.voiceChannel
      var voiceChannel = interaction.guild.channels.cache.get(player.voiceChannel)
      if (!player.queue.current) player.destroy()

      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:join:errornotcall', {
          emoji: emojis.emojierror,
          voice: vc ? (voiceChannel ? voiceChannel.name : vc) : `${t('commands:join:errornot')}`,
        })}`,
      })
    }
  },
}
