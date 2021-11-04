const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'cmdblock',
  description: 'Define se você quer boquear comandos, ou adicionar canais para o bot',
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
    { String: { name: 'comando', description: 'Qual comando deseja bloquear no servidor?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    { Channel: { name: 'canal', description: 'Qual canal deseja definir para comandos no bot?', required: false } }, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      StringChoices: {
        name: 'lista',
        description: 'Deseja ver qual lista para ver quais comandos ou canais estão ativos?',
        required: false,
        choices: [
          ['Comandos', 'comandos'],
          ['Canais', 'canais'],
        ],
      },
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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

    const commandNamee = options.getString('comando')
    const channel = options.getChannel('canal')
    const lista = options.getString('lista')

    if (commandNamee && !channel && !lista) {
      const command = commands.get(commandNamee) || commands.find((c) => c.aliases && c.aliases.includes(commandNamee))
      const listacommand = server.cmdblock.cmds

      if (!command) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:cmdblock:commandsremove.errorcommand', { emoji: emojis.emojierror })}`,
        })
      }

      if (listacommand.some((x) => x === command.name)) {
        await client.database.servidores.findOneAndUpdate(
          { idServer: interaction.guild.id },
          { $pull: { 'cmdblock.cmds': command.name } }
        )

        let embederror = new EmbedSay(interaction.member.user, t)
          .setTitle(`${t('commands:cmdblock:commandsremove.titleremocaocommand', { emoji: emojis.emojisay })}`)
          .setDescription(`${t('commands:cmdblock:commandsremove.descremocaocommand', { emoji: emojis.emojicerto })}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embederror] })
      }

      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $push: { 'cmdblock.cmds': command.name } }
      )

      let embedremovido = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:cmdblock:commandsremove.titlesucesseremove', { emoji: emojis.emojisay })}`)
        .setDescription(
          `${t('commands:cmdblock:commandsremove.descsucessremove', {
            emoji: emojis.emojicerto,
            command: command.name,
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedremovido] })
    } else if (channel && !lista && !commandNamee) {
      const channelidd = guild.channels.cache.get(channel.id)
      const realChannel = guild.channels.cache.find((x) => x.type == 'GUILD_TEXT' && x.id == channelidd.id)
      const listachannels = server.cmdblock.channels

      if (!realChannel) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:cmdblock:channelsremove.errorchannel', { emoji: emojis.emojierror })}`,
        })
      }

      if (listachannels.some((x) => x === realChannel.id)) {
        await client.database.servidores.findOneAndUpdate(
          { idServer: interaction.guild.id },
          { $pull: { 'cmdblock.channels': realChannel.id } }
        )

        let embederror = new EmbedSay(interaction.member.user, t)
          .setTitle(`${t('commands:cmdblock:channelsremove.titlechannel', { emoji: emojis.emojisay })}`)
          .setDescription(`${t('commands:cmdblock:channelsremove.deschannel', { emoji: emojis.emojicerto })}`)
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embederror] })
      }

      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $push: { 'cmdblock.channels': realChannel.id } }
      )

      let embedremovido = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:cmdblock:channelsremove.titlechannelsucess', { emoji: emojis.emojisay })}`)
        .setDescription(
          `${t('commands:cmdblock:channelsremove.deschannelsucess', {
            emoji: emojis.emojicerto,
            channel: realChannel,
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedremovido] })
    } else if (lista && !channel && !commandNamee) {
      const listacommand = server.cmdblock.cmds
      const listachannels = server.cmdblock.channels
      const listacommandformat = listacommand.map((x) => `${emojis.emojiativo} **${x}**`)
      const listachannelsformat = []

      await filterchannelsArray(client, listachannels, listachannelsformat)

      const formatchannels = listachannelsformat.map((x) => `<#${x}>`)

      if (lista === 'comandos') {
        if (!listacommand.length) {
          return interaction.reply({
            ephemeral: true,
            content: `${t('commands:cmdblock:listleave.errorlista', { emoji: emojis.emojierror })}`,
          })
        }

        let embedlistcommand = new EmbedSay(interaction.member.user, t)
          .setTitle(`${t('commands:cmdblock:listleave.titlelista', { emoji: emojis.emojisay })}`)
          .setDescription(
            `${t('commands:cmdblock:listleave.desclista', {
              emoji: emojis.emojicerto,
              lista: listacommandformat.join('\n'),
            })}`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embedlistcommand] })
      } else {
        if (!listachannels.length) {
          return interaction.reply({
            ephemeral: true,
            content: `${t('commands:cmdblock:listleave.errorlistachannel', { emoji: emojis.emojierror })}`,
          })
        }

        let embedlistchannel = new EmbedSay(interaction.member.user, t)
          .setTitle(`${t('commands:cmdblock:listleave.titlelistachannel', { emoji: emojis.emojisay })}`)
          .setDescription(
            `${t('commands:cmdblock:listleave.desclistachannel', {
              emoji: emojis.emojicerto,
              lista: formatchannels.join('\n'),
            })}`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embedlistchannel] })
      }
    } else {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:cmdblock:errorcria', { emoji: emojis.emojierror })}`,
      })
    }
  },
}

async function filterchannelsArray(client, array, result) {
  for (const channel of array) {
    let channelfilter = await client.channels.cache.get(channel)

    if (!channelfilter) {
      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $pull: { 'cmdblock.channels': channel } }
      )
      return
    }

    result.push(channelfilter.id)
  }
}
