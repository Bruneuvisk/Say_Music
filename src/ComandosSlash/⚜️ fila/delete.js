const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'delete',
  description: '[⚜️] Deleta uma playlist que você tem em mim',
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
      description: "Qual nome da sua playlist deseja deletar?",
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

    if (!arrayNames.some((x) => x === nameQueue)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:addcurrenttrack:namequeue', { emoji: emojis.emojierror, name: nameQueue })}`,
      })
    }

    const sayqueue = await client.database.queue.findOne({
      nameQueue: nameQueue,
    })

    await sayqueue.deleteOne()

    return interaction.reply({
      content: `${t('commands:delete:sucess', { emoji: emojis.emojicerto, name: nameQueue })}`,
    })
  },
}
