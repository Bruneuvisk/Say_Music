const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'settings',
  description: 'Configura as configurações de música do bot',
  cooldown: 10,
  memberperm: [
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
    Permissions.FLAGS.ADMINISTRATOR,
  ],
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
        name: 'dj_comando',
        description: 'Qual comando deseja atribuir para somente dj usar?',
        required: false,
      },
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    { Role: { name: 'cargo_dj', description: 'Qual cargo deseja atribuir para dj?', required: false } }, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "qual_lista", description: "Qual lista deseja ver?", required: false, choices: [["CargoDjs", "cargodjs"], ["ComandosDjs", "cmdjs"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    const { commands } = client
    const data = []

    const server = await client.database.servidores.findOne({
      idServer: interaction.guild.id,
    })

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

    const commandNamee = options.getString('dj_comando')
    const rolezinha = options.getRole('cargo_dj')
    const djroles = server.settings.djroles
    const commandsdjs = server.settings.commandsdj
    const djrolesmap = djroles.map((x) => `<@&${x}>`).join(', ') || `${t('commands:settings.cargodjnull')}`
    let commandsdjsmap = commandsdjs.map((x) => `${emojis.emojiativo} **${x}**`)

    if (!commandsdjs.length) {
      commandsdjsmap = `${t('commands:settings.djcommandnull')}`
    }

    if (!commandNamee && !rolezinha) {
      let embedconfig = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:settings:embedprincipal.title', { emoji: emojis.emojisay })}`)
        .setDescription(
          `${t('commands:settings:embedprincipal.desc', {
            emoji: emojis.emojicerto,
            emojiset: emojis.emojisetinha,
            rolesmap: djrolesmap,
            emojiseta: emojis.emojisetinha,
            comandmap: commandsdjsmap,
            emojicert: emojis.emojicerto,
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedconfig] })
    } else if (commandNamee && !rolezinha) {
      const command = commands.filter((x) => x.category == '🎵 música').map((command) => command.name)

      if (!command.includes(commandNamee)) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:settings:errorcommand', { emoji: emojis.emojierror })}`,
        })
      }

      if (commandsdjs.some((x) => x === commandNamee)) {
        await client.database.servidores.findOneAndUpdate(
          { idServer: interaction.guild.id },
          { $pull: { 'settings.commandsdj': commandNamee } }
        )

        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:settings:commandjremove', { emoji: emojis.emojicerto })}`,
        })
      }

      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $push: { 'settings.commandsdj': commandNamee } }
      )

      let embedsetado = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:settings:commandadd', { emoji: emojis.emojicerto, comando: commandNamee })}`
      )

      return interaction.reply({ ephemeral: true, embeds: [embedsetado] })
    } else if (rolezinha && !commandNamee) {
      if (djroles.some((x) => x === rolezinha.id)) {
        await client.database.servidores.findOneAndUpdate(
          { idServer: interaction.guild.id },
          { $pull: { 'settings.djroles': rolezinha.id } }
        )

        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:settings:roleremove', { emoji: emojis.emojierror })}`,
        })
      }

      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $push: { 'settings.djroles': rolezinha.id } }
      )

      let embedrolezinha = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:settings:roleadd', { emoji: emojis.emojicerto, role: rolezinha.id })}`
      )

      return interaction.reply({ ephemeral: true, embeds: [embedrolezinha] })
    } else {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:settings:errorcria', { emoji: emojis.emojierror })}`,
      })
    }
  },
}
