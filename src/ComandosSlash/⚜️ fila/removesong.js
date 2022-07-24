const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'removesong',
  description: '[⚜️] Removi uma música da sua playlist que foi selecionada',
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
      description: "Qual playlist deseja remover a música?",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "numero_musica",
      description: "Qual música deseja remover da playlist?",
      type: ApplicationCommandOptionType.Integer,
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
    const musicaNumber = options.getInteger('numero_musica')

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
    const mapzinha = musics.sort((x, f) => x.title - f.title).map((x, f) => f + 1)
    const pegar_music = parseInt(musicaNumber - 1)

    if (Number(musicaNumber) >= musics.length || Number(musicaNumber) < 0) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:removesong:errorum', { emoji: emojis.emojierror })}`,
      })
    }

    if (!mapzinha.find((x) => x === parseInt(musicaNumber))) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:removesong:errordois', { emoji: emojis.emojierror })}`,
      })
    }

    let embedremovido = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:removesong:embed.title', {
          emoji: emojis.emojicerto,
          music: musics[pegar_music].title,
          name: nameQueue,
        })}`.substr(0, 256)
      )
      .setDescription(
        `${t('commands:removesong:embed.desc', { emoji: emojis.emojisetinha, lista: musics.length - 1 })}`
      )
    interaction.reply({ embeds: [embedremovido] })

    await client.database.queue.findOneAndUpdate(
      { nameQueue: nameQueue },
      {
        $pull: {
          musics: musics.find((f) => f.title === mapzinha[pegar_music].title),
        },
      }
    )
  },
}
