const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'play',
  description: 'Toco músicas para alegrar seus ouvidos',
  cooldown: 5,
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
    { String: { name: 'nome_ou_url', description: 'Qual música deseja colocar pra eu tocar?', required: true } }, //to use in the code: interacton.getString("ping_amount")
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

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:play:errorinot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId != interaction.guild.me.voice.channelId
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:play:errorbotcall', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    let SearchString = options.getString('nome_ou_url')

    let CheckNode = client.manager.nodes.get(config.nodesPlayer.erelaid)

    if (!CheckNode || !CheckNode.connected) {
      return interaction.editReply({
        ephemeral: true,
        content: `${t('commands:play:lavalinkerror', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    var player = client.manager.players.get(interaction.guild.id)

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

    if (SearchString.includes('youtu')) {
      let tipo = 'musica:youtube'
      let Searched

      await interaction.reply({ content: `${t('commands:play:searchmusic', { emoji: emojis.emojiyoutube })}` })

      Searched = await player.search(
        {
          query: SearchString,
          source: tipo.split(':')[1],
        },
        interaction.member
      )

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

      if (Searched.loadType === 'PLAYLIST_LOADED') {
        if (!player.queue.current) player.destroy()
        return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
      }

      player.queue.add(Searched.tracks[0])
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: Searched.tracks[0].title })}`)
        .setURL(Searched.tracks[0].uri)
        .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:play:embed.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: Searched.tracks[0].author,
            emojise: emojis.emojisetinha,
            duration: prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
            emojiseta: emojis.emojisetinha,
            membro: Searched.tracks[0].requester.id,
          })}`
        )
      interaction.editReply({
        content: `${t('commands:play:embed.content', { emoji: emojis.emojicerto })}`,
        embeds: [SongAddedEmbed],
      })
    } else if (SearchString.includes('spotify')) {
      let tipo = 'musica:youtube'
      let Searched

      await interaction.reply({ content: `${t('commands:play:searchmusic', { emoji: emojis.emojispotify })}` })

      Searched = await player.search(
        {
          query: SearchString,
          source: tipo.split(':')[1],
        },
        interaction.member
      )

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

      if (Searched.loadType === 'PLAYLIST_LOADED') {
        if (!player.queue.current) player.destroy()
        return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
      }

      player.queue.add(Searched.tracks[0])
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: Searched.tracks[0].title })}`)
        .setURL(Searched.tracks[0].uri)
        .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:play:embed.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: Searched.tracks[0].author,
            emojise: emojis.emojisetinha,
            duration: prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
            emojiseta: emojis.emojisetinha,
            membro: Searched.tracks[0].requester.id,
          })}`
        )
      interaction.editReply({
        content: `${t('commands:play:embed.content', { emoji: emojis.emojicerto })}`,
        embeds: [SongAddedEmbed],
      })
    } else if (SearchString.includes('soundcloud')) {
      let tipo = 'musica:soundcloud'
      let Searched

      await interaction.reply({ content: `${t('commands:play:searchmusic', { emoji: emojis.emojisoudcloud })}` })

      Searched = await player.search(
        {
          query: SearchString,
          source: tipo.split(':')[1],
        },
        interaction.member
      )

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

      if (Searched.loadType === 'PLAYLIST_LOADED') {
        if (!player.queue.current) player.destroy()
        return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
      }

      player.queue.add(Searched.tracks[0])
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: Searched.tracks[0].title })}`)
        .setURL(Searched.tracks[0].uri)
        .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:play:embed.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: Searched.tracks[0].author,
            emojise: emojis.emojisetinha,
            duration: prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
            emojiseta: emojis.emojisetinha,
            membro: Searched.tracks[0].requester.id,
          })}`
        )
      interaction.editReply({
        content: `${t('commands:play:embed.content', { emoji: emojis.emojicerto })}`,
        embeds: [SongAddedEmbed],
      })
    } else if (SearchString.includes('http')) {
      let tipo = 'musica:youtube'
      let Searched

      await interaction.reply({ content: `${t('commands:play:searchmusic', { emoji: emojis.emojisay })}` })

      Searched = await player.search(
        {
          query: SearchString,
          source: tipo.split(':')[1],
        },
        interaction.member
      )

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

      if (Searched.loadType === 'PLAYLIST_LOADED') {
        if (!player.queue.current) player.destroy()
        return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
      }

      player.queue.add(Searched.tracks[0])
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: Searched.tracks[0].title })}`)
        .setURL(Searched.tracks[0].uri)
        .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:play:embed.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: Searched.tracks[0].author,
            emojise: emojis.emojisetinha,
            duration: prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
            emojiseta: emojis.emojisetinha,
            membro: Searched.tracks[0].requester.id,
          })}`
        )
      interaction.editReply({
        content: `${t('commands:play:embed.content', { emoji: emojis.emojicerto })}`,
        embeds: [SongAddedEmbed],
      })
    } else {
      let tipo = 'musica:youtube'
      let Searched

      await interaction.reply({ content: `${t('commands:play:searchmusic', { emoji: emojis.emojiyoutube })}` })

      Searched = await player.search(
        {
          query: SearchString,
          source: tipo.split(':')[1],
        },
        interaction.member
      )

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

      if (Searched.loadType === 'PLAYLIST_LOADED') {
        if (!player.queue.current) player.destroy()
        return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
      }

      player.queue.add(Searched.tracks[0])
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: Searched.tracks[0].title })}`)
        .setURL(Searched.tracks[0].uri)
        .setThumbnail(`https://img.youtube.com/vi/${Searched.tracks[0].identifier}/mqdefault.jpg`)
        .setDescription(
          `${t('commands:play:embed.desc', {
            emoji: emojis.emojicarregando,
            emojis: emojis.emojisetinha,
            author: Searched.tracks[0].author,
            emojise: emojis.emojisetinha,
            duration: prettyMilliseconds(Searched.tracks[0].duration, { colonNotation: true }),
            emojiset: emojis.emojisetinha,
            position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
            emojiseta: emojis.emojisetinha,
            membro: Searched.tracks[0].requester.id,
          })}`
        )
      interaction.editReply({
        content: `${t('commands:play:embed.content', { emoji: emojis.emojicerto })}`,
        embeds: [SongAddedEmbed],
      })
    }
  },
}
