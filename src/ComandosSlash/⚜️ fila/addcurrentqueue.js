const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'addcurrentqueue',
  description: 'Adiciona para sua playlist a fila de músicas que está sendo tocada atualmente',
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
      String: { name: 'nome_da_fila', description: 'Qual playlist deseja atribuir a fila de músicas?', required: true },
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

    let player = await client.manager.players.get(interaction.guild.id)
    const tracks = player.queue

    const queuesMember = await require('mongoose')
      .connection.collection('queues')
      .find({ idUser: interaction.member.id })
      .toArray()
    let arrayNames = []

    for (const names of queuesMember) arrayNames.push(names.nameQueue)

    const nameQueue = options.getString('nome_da_fila')

    if (!player) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notocad', { emoji: emojis.emojierror })}`,
      })
    }

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

    if (!tracks.length) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrentqueue:errornot', { emoji: emojis.emojierror })}`,
      })
    }

    if (!arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:namequeue', { emoji: emojis.emojierror, name: nameQueue })}`,
      })
    }

    let sayqueue = await client.database.queue.findOne({
      nameQueue: nameQueue,
    })

    let musics = sayqueue.musics
    let totalmusics = musics.length + tracks.length
    if (player.queue.current) totalmusics + 1

    let embedqueue = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:addcurrentqueue:embed.title', {
          emoji: emojis.emojicerto,
          tracks: tracks.length,
          name: nameQueue,
        })}`
      )
      .setDescription(`${t('commands:addcurrentqueue:embed.desc', { emoji: emojis.emojisetinha, total: totalmusics })}`)
    interaction.reply({ embeds: [embedqueue] })

    for (const track of tracks)
      await client.database.queue.findOneAndUpdate(
        { nameQueue: nameQueue },
        {
          $push: {
            musics: {
              title: track.title,
              url: track.uri,
              duration: track.duration,
            },
          },
        }
      )

    if (player.queue.current) {
      await client.database.queue.findOneAndUpdate(
        { nameQueue: nameQueue },
        {
          $push: {
            musics: {
              title: player.queue.current.title,
              url: player.queue.current.uri,
              duration: player.queue.current.duration,
            },
          },
        }
      )
    }
  },
}
