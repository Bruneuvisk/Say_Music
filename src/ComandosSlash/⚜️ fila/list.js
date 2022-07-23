const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { paginateItens } = require('../../Struturas/Functions')
const _ = require('lodash')

module.exports = {
  name: 'list',
  description: 'Lista as suas playlists que você possui em mim',
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
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

    const queuesMember = await require('mongoose')
      .connection.collection('queues')
      .find({ idUser: interaction.member.id })
      .toArray()

    if (!queuesMember) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:list:errorqueue', { emoji: emojis.emojierror })}`,
      })
    }

    let SplitedQueue = _.chunk(queuesMember, 10)

    let Pages = SplitedQueue.map((x) => {
      let Description = x.map((te) => `${t('commands:list:format', { queue: te.nameQueue, len: te.musics.length })}`)

      let embeddesc = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:list:embed.title', { emoji: emojis.emojicerto })}`)
        .setDescription(`${t('commands:list:embed.desc', { emoji: emojis.emojisetinha, desc: Description })}`)
      return embeddesc
    })

    if (!Pages.length || Pages.length === 1) return interaction.reply({ embeds: [Pages[0]] })
    else return paginateItens(interaction, Pages)
  },
}
