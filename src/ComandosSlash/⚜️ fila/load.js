const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { TrackUtils } = require('erela.js')

module.exports = {
  name: 'load',
  description: 'Coloca alguma playlist sua pra tocar no servidor',
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
      name: "nome_da_playlist",
      description: "Qual nome da sua playlist deseja colocar pra tocar?",
      type: ApplicationCommandOptionType.String,
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

    let player = await client.manager.players.get(interaction.guild.id)
    const { channel } = interaction.member.voice;

    const queuesMember = await require('mongoose')
      .connection.collection('queues')
      .find({ idUser: interaction.member.id })
      .toArray()
    let arrayNames = []

    for (const names of queuesMember) arrayNames.push(names.nameQueue)

    const nameQueue = options.getString('nome_da_playlist')

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

    if (!arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:namequeue', { emoji: emojis.emojierror, name: nameQueue })}`,
      })
    }

    if (!player) {
      player = client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        textChannel: interaction.channel.id,
        selfDeafen: true,
      })
    }
    if (player.state != 'CONNECTED') {
      await player.connect()
    }

    const sayqueue = await client.database.queue.findOne({
      nameQueue: nameQueue,
    })

    let embedcolocando = new EmbedSay(interaction.member.user, t).setDescription(
      `${t('commands:load:errornot', { emoji: emojis.emojicerto, len: sayqueue.musics.length })}`
    )
    await interaction.reply({ embeds: [embedcolocando] })

    for (const track of sayqueue.musics) {
      const unresolvedTrack = TrackUtils.buildUnresolved(
        {
          title: track.title,
          url: track.url,
          duration: track.duration,
        },
        interaction.member
      )
      player.queue.add(unresolvedTrack)
    }
    player.play()
  },
}
