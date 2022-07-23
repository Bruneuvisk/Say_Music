const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const _ = require('lodash')
const { paginateItens, format } = require('../../Struturas/Functions')

module.exports = {
  name: 'details',
  description: 'Exibe os detalhes da sua playlist em mim',
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
      description: "Qual nome da sua playlist deseja exibir os detalhes?",
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

    const queuesMember = await require('mongoose')
      .connection.collection('queues')
      .find({ idUser: interaction.member.id })
      .toArray()
    let arrayNames = []

    for (const names of queuesMember) arrayNames.push(names.nameQueue)

    const nameQueue = options.getString('nome_da_playlist')

    if (!queuesMember) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:list:errorqueue', { emoji: emojis.emojierror })}`,
      })
    }

    if (!arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:namequeue', { emoji: emojis.emojierror, name: nameQueue })}`,
      })
    }

    const sayqueue = await client.database.queue.findOne({
      nameQueue: nameQueue,
    })

    const tracks = sayqueue.musics

    let SplitedTracks = _.chunk(tracks, 15)

    let Pages = SplitedTracks.map((x) => {
      let SongsDescription = x
        .map(
          (te, index) =>
            `\`${index + 1}.\` [${te.title.split(`]`).join(`}`).split(`[`).join(`{`).substr(0, 60)}](${
              te.url
            }) \n \`${format(te.duration)}\` \n`
        )
        .join('\n')

      let embedzinha = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:details:embed.title', { emoji: emojis.emojicerto, queue: nameQueue })}`)
        .setDescription(`${t('commands:details:embed.desc', { emoji: emojis.emojisetinha, desc: SongsDescription })}`)
      return embedzinha
    })

    if (!Pages.length || Pages.length === 1) return interaction.reply({ embeds: [Pages[0]] })
    else return paginateItens(interaction, Pages)
  },
}
