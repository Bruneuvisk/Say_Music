const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'playlist',
  description: 'Faz eu tocar alguma playlist sua atráves do link da mesma',
  cooldown: 15,
  memberperm: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_APPLICATION_COMMANDS],
  clientperm: [
    Permissions.FLAGS.EMBED_LINKS,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    { String: { name: 'playlist_url', description: 'Qual playlist deseja colocar pra eu tocar?', required: true } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId != interaction.guild.me.voice.channelId
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!CheckNode || !CheckNode.connected) {
      return interaction.editReply({
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
