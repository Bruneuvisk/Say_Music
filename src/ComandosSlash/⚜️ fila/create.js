const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'create',
  description: 'Cria uma playlist exclusiva sua em mim',
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
      description: "Qual nome deseja atribuir a sua playlist?",
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

    if (nameQueue.length > 10) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:create:errorlength', { emoji: emojis.emojierror })}`,
      })
    }

    if (arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:create:errorname', { emoji: emojis.emojierror })}`,
      })
    }

    await client.database.queue.create({
      idUser: interaction.member.id,
      nameQueue: nameQueue,
    })

    return interaction.reply({
      content: `${t('commands:create:sucess', { emoji: emojis.emojicerto, queue: nameQueue })}`,
    })
  },
}
