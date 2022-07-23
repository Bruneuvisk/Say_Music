const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'addcurrenttrack',
  description: 'Adiciona para sua playlist a música que está sendo tocada atualmente',
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
      name: "nome_da_fila",
      description: "Qual playlist deseja atribuir a música?",
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

    let player = await client.manager.players.get(interaction.guild.id)
    const track = player.queue.current
    const { channel } = interaction.member.voice;

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
      player && channel.id !== player.voiceChannel
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!track) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:errornot', { emoji: emojis.emojierror })}`,
      })
    }

    if (!arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:namequeue', { emoji: emojis.emojierror, name: nameQueue })}`,
      })
    }

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

    let sayqueue = await client.database.queue.findOne({
      nameQueue: nameQueue,
    })

    let musics = sayqueue.musics
    let totalmusics = musics.length + 1

    let embednewmusic = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:addcurrenttrack:embed.title', {
          emoji: emojis.emojicerto,
          title: track.title,
          name: nameQueue,
        })}`
      )
      .setDescription(
        `${t('commands:addcurrenttrack:embed.desc', { emoji: emojis.emojisetinha, musics: totalmusics })}`
      )
    return interaction.reply({ embeds: [embednewmusic] })
  },
}
