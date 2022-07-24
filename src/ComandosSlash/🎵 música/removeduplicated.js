const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'removeduplicated',
  description: '[🎵] Remove todos as músicas duplicadas em sua fila de músicas',
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

    let tracks = player.queue
    const newtracks = []
    for (let i = 0; i < tracks.length; i++) {
      let exists = false
      for (let j = 0; j < newtracks.length; j++) {
        if (tracks[i].uri === newtracks[j].uri) {
          exists = true
          break
        }
      }
      if (!exists) {
        newtracks.push(tracks[i])
      }
    }

    player.queue.clear()

    for (const track of newtracks) player.queue.add(track)

    return interaction.reply({ content: `${t('commands:removeduplicated:sucess', { emoji: emojis.emojicerto })}` })
  },
}
