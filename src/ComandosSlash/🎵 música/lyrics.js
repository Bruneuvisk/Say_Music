const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const lyricsFinder = require('lyrics-finder')
const _ = require('lodash')
const { paginateItens } = require('../../Struturas/Functions')

module.exports = {
  name: 'lyrics',
  description: '[🎵] Exibe a letra da música que queira ou a que está sendo tocada',
  cooldown: 10,
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
      name: "nome_musica",
      description: "Qual música deseja exibir a letra?",
      type: ApplicationCommandOptionType.String,
      required: false,
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
