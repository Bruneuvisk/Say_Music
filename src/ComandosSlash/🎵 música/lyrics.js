const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const lyricsFinder = require('lyrics-finder')
const _ = require('lodash')
const { paginateItens } = require('../../Struturas/Functions')

module.exports = {
  name: 'lyrics',
  description: 'Exibe a letra da música que queira ou a que está sendo tocada',
  cooldown: 10,
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
    { String: { name: 'nome_musica', description: 'Qual música deseja exibir a letra?', required: false } }, //to use in the code: interacton.getString("ping_amount")
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

    let player = await client.manager.players.get(interaction.guild.id)
    let SongTitle = options.getString('nome_musica')

    if (!SongTitle && !player) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:lyrics.errornot', { emoji: emojis.emojierror })}`,
      })
    }

    if (!SongTitle) SongTitle = player.queue.current.title

    let lyrics = await lyricsFinder(SongTitle)

    if (!lyrics) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:lyrics.notlyrics', { emoji: emojis.emojierror, title: SongTitle })}`,
      })
    }

    lyrics = lyrics.split('\n')
    let SplitedLyrics = _.chunk(lyrics, 40)

    let Pages = SplitedLyrics.map((ly) => {
      let em = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:lyrics:embed.title', { emoji: emojis.emojiyoutube, title: SongTitle })}`)
        .setDescription(ly.join('\n'))

      if (SongTitle !== SongTitle) em.setThumbnail(player.queue.current.displayThumbnail())

      return em
    })

    if (!Pages.length || Pages.length === 1) return interaction.reply({ embeds: [Pages[0]] })
    else return paginateItens(interaction, Pages)
  },
}
