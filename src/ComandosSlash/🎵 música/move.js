const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { arrayMove } = require('../../Struturas/Functions')

module.exports = {
  name: 'move',
  description: '[🎵] Troca a posição de uma música na fila pra outro posição',
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
      name: "posição_da_musica",
      description: "Envie a posição da música que quer mudar",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "posição_final",
      description: "Pra qual posição deseja colocar sua música?",
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

    const toposition = options.getInteger('posição_da_musica')
    const fromposition = options.getInteger('posição_final')

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

    if (isNaN(toposition) || toposition <= 1 || toposition > player.queue.length) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:move:errornoposition', { emoji: emojis.emojierror })}`,
      })
    }

    let song = player.queue[player.queue.length - 1]

    let QueueArray = arrayMove(player.queue, player.queue.length - 1, 0)

    player.queue.clear()

    for (const track of QueueArray) player.queue.add(track)

    let embedzinho = new EmbedSay(interaction.member.user, t)
      .setDescription(`${t('commands:move:sucess', { emoji: emojis.emojicerto, to: toposition, from: fromposition })}`)
      .setTitle(`[${song.title}](${song.uri})`)
      .setThumbnail(song.displayThumbnail())

    return interaction.reply({ embeds: [embedzinho] })
  },
}
