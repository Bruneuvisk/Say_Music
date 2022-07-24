const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'playlist',
  description: '[🎵] Faz eu tocar alguma playlist sua atráves do link da mesma',
  cooldown: 15,
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
      name: "playlist_url",
      description: "Qual playlist deseja colocar pra eu tocar?",
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

    let SearchString = options.getString('playlist_url')
    let player = await client.manager.players.get(interaction.guild.id)
    let CheckNode = client.manager.nodes.get(config.nodesPlayer.erelaid)
    const { channel } = interaction.member.voice;

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!CheckNode || !CheckNode.connected) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:play:lavalinkerror', { emoji: emojis.emojierror, membro: interaction.member })}`,
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
    
    if (
      player && channel.id !== player.voiceChannel
    ) {
      if (!player.queue.current) player.destroy()
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    await interaction.reply({ content: `${t('commands:playlist:search', { emoji: emojis.emojicarregando })}` })

    let Searched = await player.search(SearchString, interaction.member)

    if (Searched.loadType === 'LOAD_FAILED') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({ content: `${t('commands:play:loadfailed', { emoji: emojis.emojierror })}` })
    }

    if (Searched.loadType === 'NO_MATCHES') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({
        content: `${t('commands:play:nomatches', { emoji: emojis.emojierror, pesquisa: SearchString })}`,
      })
    }

    if (Searched.loadType === 'SEARCH_RESULT') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({ content: `${t('commands:playlist:errornot', { emoji: emojis.emojierror })}` })
    }

    player.queue.add(Searched.tracks)
    if (!player.playing && !player.paused && player.queue.totalSize === Searched.tracks.length) player.play()

    let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:playlist:embed.title', {
          emoji: emojis.emojicoroa,
          playlist: Searched.playlist.name || `${t('commands:playlist:embed.subject')}`,
        })}`
      )
      .setURL(Searched.playlist.uri)
      .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
      .setDescription(
        `${t('commands:playlist:embed.desc', {
          emoji: emojis.emojicarregando,
          emojiseta: emojis.emojisetinha,
          duration: prettyMilliseconds(Searched.playlist.duration, { colonNotation: true }),
          lista: player.queue.length,
          author: interaction.member.id,
        })}`
      )
    interaction.editReply({
      content: `${t('commands:playlist:content', { emoji: emojis.emojicerto })}`,
      embeds: [SongAddedEmbed],
    })
  },
}
