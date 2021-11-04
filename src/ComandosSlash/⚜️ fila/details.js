const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const _ = require('lodash')
const { paginateItens, format } = require('../../Struturas/Functions')

module.exports = {
  name: 'details',
  description: 'Exibe os detalhes da sua playlist em mim',
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
    {
      String: {
        name: 'nome_da_fila',
        description: 'Qual nome da sua playlist deseja exibir os detalhes?',
        required: true,
      },
    }, //to use in the code: interacton.getString("ping_amount")
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

    const queuesMember = await require('mongoose')
      .connection.collection('queues')
      .find({ idUser: interaction.member.id })
      .toArray()
    let arrayNames = []

    for (const names of queuesMember) arrayNames.push(names.nameQueue)

    const nameQueue = options.getString('nome_da_fila')

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
