const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'search',
  description: 'Pesquisa alguma música no yotube para ser adicionada na sua fila de músicas',
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
    { String: { name: 'nome_ou_url', description: 'Qual música deseja buscar?', required: true } }, //to use in the code: interacton.getString("ping_amount")
    //{ User: { name: 'membro', description: 'Qual membro deseja pegar as informações?', required: false } }, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    /*{
      StringChoices: {
        name: 'qual_ping',
        description: 'Qual ping você quer saber sobre mim?',
        required: true,
        choices: [
          ['bot', 'botping'],
          ['Discord Api', 'discord_api'],
        ],
      },
    },*/
    //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
    const argsMusic = options.getString('nome_ou_url')

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
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
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    let embedsearch = new EmbedSay(interaction.member.user, t).setDescription(
      `${t('commands:search:searcksls', { emoji: emojis.emojiyoutube })}`
    )
    await interaction.reply({ embeds: [embedsearch] })

    let tipo = 'pesquisar:youtube'
    let pesquisa
    let max = 10
    let track

    pesquisa = await client.manager.search(
      {
        query: argsMusic,
        source: tipo.split(':')[1],
      },
      interaction.member
    )

    if (pesquisa.loadType === 'LOAD_FAILED') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({ content: `${t('commands:play:loadfailed', { emoji: emojis.emojierror })}` })
    }

    if (pesquisa.loadType === 'NO_MATCHES') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({
        content: `${t('commands:play:nomatches', { emoji: emojis.emojierror, pesquisa: argsMusic })}`,
      })
    }

    if (pesquisa.loadType === 'PLAYLIST_LOADED') {
      if (!player.queue.current) player.destroy()
      return interaction.editReply({ content: `${t('commands:play:loadplaylist', { emoji: emojis.emojierror })}` })
    }

    if (pesquisa.tracks.length < max) max = pesquisa.tracks.length
    track = pesquisa.tracks[0]

    var results = pesquisa.tracks
      .slice(0, max)
      .map(
        (track, index) =>
          `**${++index})** | [\`${String(track.title).substr(0, 60).split('[').join('{').split(']').join('}')}\`](${
            track.uri
          }) - \`${prettyMilliseconds(track.duration, { colonNotation: true }).split(' | ')[0]}\``
      )
      .join('\n')

    let coletado
    let embedpesquisas = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:search:embedsearch.title', { emoji: emojis.emojicerto, music: argsMusic })}`)
      .setDescription(`${t('commands:search:embedsearch.desc', { emoji: emojis.emojisetinha, result: results })}`)
    interaction.editReply({ embeds: [embedpesquisas] })

    await interaction.channel
      .awaitMessages({
        filter: (m) => m.author.id === interaction.member.id && /^(\d+|end)$/i.test(m.content),
        max: 1,
        time: 60000,
        errors: ['time'],
      })
      .then((collected) => {
        coletado = collected.first().content
        collected.first().delete()
      })
      .catch((err) => {
        if (!player.queue.current) player.destroy()
        let embed1 = new EmbedSay(interaction.member.user, t)
          .setTitle(`${t('commands:search:embederrortime.title', { emoji: emojis.emojitempo })}`)
          .setDescription(`${t('commands:search:embederrortime.desc', { emoji: emojis.emojicerto })}`)
        interaction.editReply({
          embeds: [embed1],
        })
        return
      })

    if (coletado.toLowerCase() === 'cancel') {
      if (!player.queue.current) player.destroy()
      let embecancel = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:search:embedcancel.desc', { emoji: emojis.emojicerto })}`
      )
      return interaction.editReply({ embeds: [embecancel] })
    }

    var index = Number(coletado) - 1

    if (index < 0 || index > max - 1) {
      if (!player.queue.current) player.destroy()
      let embedposso = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:search:embednotindex.desc', { emoji: emojis.emojierror })}`
      )
      return interaction.editReply({ embeds: [embedposso] })
    }

    track = pesquisa.tracks[index]

    if (!pesquisa.tracks[0]) {
      if (!player.queue.current) player.destroy()
      let embedtrack = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:search:embednottrack.desc', { emoji: emojis.emojierror, music: argsMusic })}`
      )
      return interaction.editReply({ embeds: [embedtrack] })
    }

    player.queue.add(track)
    if (!player.playing && !player.paused && !player.queue.size) player.play()

    let SongAddedEmbed = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:play:embed.title', { emoji: emojis.emojicoroa, music: track.title })}`)
      .setURL(track.uri)
      .setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
      .setDescription(
        `${t('commands:play:embed.desc', {
          emoji: emojis.emojicarregando,
          emojis: emojis.emojisetinha,
          author: track.author,
          emojise: emojis.emojisetinha,
          duration: prettyMilliseconds(track.duration, { colonNotation: true }),
          emojiset: emojis.emojisetinha,
          position: player.queue.size - 0 || `${t('commands:play:embed.primefile')}`,
          emojiseta: emojis.emojisetinha,
          membro: track.requester.id,
        })}`
      )
    return interaction.editReply({ embeds: [SongAddedEmbed] })
  },
}
