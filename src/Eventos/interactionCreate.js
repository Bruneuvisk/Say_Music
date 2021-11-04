const { MessageEmbed, Permissions, Collection, WebhookClient } = require('discord.js')
const EmbedSay = require('../Struturas/EmbedSay')
const config = require('../Interfaces/config.json')
const emojis = require('../Interfaces/emojis.json')
const { getPrefix } = require('../Struturas/Functions')
const moment = require('moment')
moment.locale('pt-BR')
let t

module.exports = async (client, interaction) => {
  if (!interaction.isCommand()) return

  const CategoryName = interaction.commandName
  let command = false

  if (client.slashCommands.has(CategoryName + interaction.options.getSubcommand())) {
    command = client.slashCommands.get(CategoryName + interaction.options.getSubcommand())
  }

  if (client.slashCommands.has('normal' + CategoryName)) {
    command = client.slashCommands.get('normal' + CategoryName)
  }

  const prefix = await getPrefix(interaction.guild.id, client)
  const color = config.color
  const language = await client.getLanguage(interaction.guild.id)

  try {
    t = await client.getTranslate(interaction.guild.id)
  } catch (e) {
    console.error(e)
  }
  const server = await client.database.servidores.findOne({
    idServer: interaction.guild.id,
  })
  const channelses = server.cmdblock.channels
  const cmdss = server.cmdblock.cmds
  const djroles = server.settings.djroles
  const commandsdj = server.settings.commandsdj

  const cliente = await client.database.cliente.findOne({
    _id: client.user.id,
  })

  if (!server) {
    await client.database.servidores.create({
      idServer: interaction.guild.id,
    })
  }

  if (!cliente) {
    await client.database.cliente.create({
      _id: client.user.id,
      reason: '',
      manutenção: false,
    })
  }

  if (command) {
    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection())
    }

    const now = Date.now()
    const timestamps = client.cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(interaction.member.id)) {
      const expirationTime = timestamps.get(interaction.member.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        let embedtime = new EmbedSay(interaction.member.user, t)
          .setDescription(
            `${t('commands:cooldown.message', {
              emoji: emojis.emojitempo,
              membro: interaction.member,
              tempo: timeLeft.toFixed(1),
              comando: command.name,
            })}`
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        return interaction.reply({ ephemeral: true, embeds: [embedtime] })
      }
    }

    if (cliente.blacklist.some((x) => x == interaction.member.id)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:blacklist.message', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!config.ownerID.includes(interaction.member.id)) {
      if (cliente.manutenção) {
        let embedmanu = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:manumessage.message', {
            emoji: emojis.emojierror,
            membro: interaction.member,
            reason: cliente.reason,
          })}`
        )
        return interaction.reply({ ephemeral: true, embeds: [embedmanu] })
      }
    }

    if (channelses.length >= 1) {
      if (
        !channelses.includes(interaction.channel.id) &&
        !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)
      ) {
        const arraycria = []

        await filterchannelsArray(client, channelses, arraycria)

        let embedzinho = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:channelsblock.message', {
            emoji: emojis.emojierror,
            array: arraycria.map((x) => `<#${x}>`).join(', '),
          })}`
        )
        return interaction.reply({ ephemeral: true, embeds: [embedzinho] })
      }
    }

    if (cmdss.some((x) => x === command.name)) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:cmdblockk.message', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (commandsdj.length && commandsdj.includes(command.name)) {
      let temdj = false
      let rolesdj
      const player = client.manager.players.get(interaction.guild.id)

      for (let i = 0; i < djroles.length; i++) {
        if (interaction.member.roles.cache.has(djroles[i])) temdj = true
        if (!interaction.guild.roles.cache.get(djroles[i])) continue
        rolesdj += '<@&' + djroles[i] + '> | '
      }

      if (!temdj && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        if (player && player.queue.current.requester.id !== interaction.member.id) {
          let embedzinha = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:djblock.title', { emoji: emojis.emojierror })}`)
            .setDescription(
              `${t('commands:djblock.desc', {
                emoji: emojis.emojierror,
                roles: rolesdj,
                emojicert: emojis.emojicerto,
                player: player.queue.current.requester,
              })}`
            )
          return interaction.reply({ ephemeral: true, embeds: [embedzinha] })
        }
      }
    }

    if (command.memberperm && !interaction.member.permissions.has(command.memberperm)) {
      let permissions = []

      if (command.memberperm.includes(Permissions.FLAGS.ADMINISTRATOR))
        permissions.push(`${t('commands:perms.ADMINISTRATOR')}`)
      if (command.memberperm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG))
        permissions.push(`${t('commands:perms.VIEW_AUDIT_LOG')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_GUILD))
        permissions.push(`${t('commands:perms.MANAGE_GUILD')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_ROLES))
        permissions.push(`${t('commands:perms.MANAGE_ROLES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_CHANNELS))
        permissions.push(`${t('commands:perms.MANAGE_CHANNELS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.KICK_MEMBERS))
        permissions.push(`${t('commands:perms.KICK_MEMBERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.BAN_MEMBERS))
        permissions.push(`${t('commands:perms.BAN_MEMBERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE))
        permissions.push(`${t('commands:perms.CREATE_INSTANT_INVITE')}`)
      if (command.memberperm.includes(Permissions.FLAGS.CHANGE_NICKNAME))
        permissions.push(`${t('commands:perms.CHANGE_NICKNAME')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_NICKNAMES))
        permissions.push(`${t('commands:perms.MANAGE_NICKNAMES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
        permissions.push(`${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS))
        permissions.push(`${t('commands:perms.MANAGE_WEBHOOKS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.VIEW_CHANNEL))
        permissions.push(`${t('commands:perms.VIEW_CHANNEL')}`)
      if (command.memberperm.includes(Permissions.FLAGS.SEND_MESSAGES))
        permissions.push(`${t('commands:perms.SEND_MESSAGES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES))
        permissions.push(`${t('commands:perms.SEND_TTS_MESSAGES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_MESSAGES))
        permissions.push(`${t('commands:perms.MANAGE_MESSAGES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.EMBED_LINKS))
        permissions.push(`${t('commands:perms.EMBED_LINKS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.ATTACH_FILES))
        permissions.push(`${t('commands:perms.ATTACH_FILES')}`)
      if (command.memberperm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY))
        permissions.push(`${t('commands:perms.READ_MESSAGE_HISTORY')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MENTION_EVERYONE))
        permissions.push(`${t('commands:perms.MENTION_EVERYONE')}`)
      if (command.memberperm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
        permissions.push(`${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.ADD_REACTIONS))
        permissions.push(`${t('commands:perms.ADD_REACTIONS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.CONNECT)) permissions.push(`${t('commands:perms.CONNECT')}`)
      if (command.memberperm.includes(Permissions.FLAGS.SPEAK)) permissions.push(`${t('commands:perms.SPEAK')}`)
      if (command.memberperm.includes(Permissions.FLAGS.STREAM)) permissions.push(`${t('commands:perms.STREAM')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MUTE_MEMBERS))
        permissions.push(`${t('commands:perms.MUTE_MEMBERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.DEAFEN_MEMBERS))
        permissions.push(`${t('commands:perms.DEAFEN_MEMBERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MOVE_MEMBERS))
        permissions.push(`${t('commands:perms.MOVE_MEMBERS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.USE_VAD)) permissions.push(`${t('commands:perms.USE_VAD')}`)
      if (command.memberperm.includes(Permissions.FLAGS.PRIORITY_SPEAKER))
        permissions.push(`${t('commands:perms.PRIORITY_SPEAKER')}`)
      if (command.memberperm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS))
        permissions.push(`${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS))
        permissions.push(`${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK))
        permissions.push(`${t('commands:perms.REQUEST_TO_SPEAK')}`)
      if (command.memberperm.includes(Permissions.FLAGS.MANAGE_THREADS))
        permissions.push(`${t('commands:perms.MANAGE_THREADS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS))
        permissions.push(`${t('commands:perms.USE_PUBLIC_THREADS')}`)
      if (command.memberperm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS))
        permissions.push(`${t('commands:perms.USE_PRIVATE_THREADS')}`)

      let embedperms = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:perms:errormemberperm.title', { emoji: emojis.emojierror })}`)
        .setDescription(
          `${t('commands:perms:errormemberperm.description', {
            emoji: emojis.emojierror,
            membro: interaction.member,
            perms: permissions.join(', '),
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedperms] })
    }

    if (
      command.clientperm &&
      !interaction.guild.members.cache.get(client.user.id).permissions.has(command.clientperm)
    ) {
      let permissions = []

      if (command.clientperm.includes(Permissions.FLAGS.ADMINISTRATOR))
        permissions.push(`${t('commands:perms.ADMINISTRATOR')}`)
      if (command.clientperm.includes(Permissions.FLAGS.VIEW_AUDIT_LOG))
        permissions.push(`${t('commands:perms.VIEW_AUDIT_LOG')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_GUILD))
        permissions.push(`${t('commands:perms.MANAGE_GUILD')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_ROLES))
        permissions.push(`${t('commands:perms.MANAGE_ROLES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_CHANNELS))
        permissions.push(`${t('commands:perms.MANAGE_CHANNELS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.KICK_MEMBERS))
        permissions.push(`${t('commands:perms.KICK_MEMBERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.BAN_MEMBERS))
        permissions.push(`${t('commands:perms.BAN_MEMBERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.CREATE_INSTANT_INVITE))
        permissions.push(`${t('commands:perms.CREATE_INSTANT_INVITE')}`)
      if (command.clientperm.includes(Permissions.FLAGS.CHANGE_NICKNAME))
        permissions.push(`${t('commands:perms.CHANGE_NICKNAME')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_NICKNAMES))
        permissions.push(`${t('commands:perms.MANAGE_NICKNAMES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS))
        permissions.push(`${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_WEBHOOKS))
        permissions.push(`${t('commands:perms.MANAGE_WEBHOOKS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.VIEW_CHANNEL))
        permissions.push(`${t('commands:perms.VIEW_CHANNEL')}`)
      if (command.clientperm.includes(Permissions.FLAGS.SEND_MESSAGES))
        permissions.push(`${t('commands:perms.SEND_MESSAGES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.SEND_TTS_MESSAGES))
        permissions.push(`${t('commands:perms.SEND_TTS_MESSAGES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_MESSAGES))
        permissions.push(`${t('commands:perms.MANAGE_MESSAGES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.EMBED_LINKS))
        permissions.push(`${t('commands:perms.EMBED_LINKS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.ATTACH_FILES))
        permissions.push(`${t('commands:perms.ATTACH_FILES')}`)
      if (command.clientperm.includes(Permissions.FLAGS.READ_MESSAGE_HISTORY))
        permissions.push(`${t('commands:perms.READ_MESSAGE_HISTORY')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MENTION_EVERYONE))
        permissions.push(`${t('commands:perms.MENTION_EVERYONE')}`)
      if (command.clientperm.includes(Permissions.FLAGS.USE_EXTERNAL_EMOJIS))
        permissions.push(`${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.ADD_REACTIONS))
        permissions.push(`${t('commands:perms.ADD_REACTIONS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.CONNECT)) permissions.push(`${t('commands:perms.CONNECT')}`)
      if (command.clientperm.includes(Permissions.FLAGS.SPEAK)) permissions.push(`${t('commands:perms.SPEAK')}`)
      if (command.clientperm.includes(Permissions.FLAGS.STREAM)) permissions.push(`${t('commands:perms.STREAM')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MUTE_MEMBERS))
        permissions.push(`${t('commands:perms.MUTE_MEMBERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.DEAFEN_MEMBERS))
        permissions.push(`${t('commands:perms.DEAFEN_MEMBERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MOVE_MEMBERS))
        permissions.push(`${t('commands:perms.MOVE_MEMBERS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.USE_VAD)) permissions.push(`${t('commands:perms.USE_VAD')}`)
      if (command.clientperm.includes(Permissions.FLAGS.PRIORITY_SPEAKER))
        permissions.push(`${t('commands:perms.PRIORITY_SPEAKER')}`)
      if (command.clientperm.includes(Permissions.FLAGS.VIEW_GUILD_INSIGHTS))
        permissions.push(`${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.USE_APPLICATION_COMMANDS))
        permissions.push(`${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.REQUEST_TO_SPEAK))
        permissions.push(`${t('commands:perms.REQUEST_TO_SPEAK')}`)
      if (command.clientperm.includes(Permissions.FLAGS.MANAGE_THREADS))
        permissions.push(`${t('commands:perms.MANAGE_THREADS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.USE_PUBLIC_THREADS))
        permissions.push(`${t('commands:perms.USE_PUBLIC_THREADS')}`)
      if (command.clientperm.includes(Permissions.FLAGS.USE_PRIVATE_THREADS))
        permissions.push(`${t('commands:perms.USE_PRIVATE_THREADS')}`)

      let embedperms = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:perms:errorclientperm.title', { emoji: emojis.emojierror })}`)
        .setDescription(
          `${t('commands:perms:errorclientperm.description', {
            emoji: emojis.emojierror,
            membro: interaction.member,
            perms: permissions.join(', '),
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedperms] })
    }

    if (
      command.requiredroles &&
      command.requiredroles.length > 0 &&
      interaction.member.roles.cache.size > 0 &&
      !interaction.member.roles.cache.some((r) => command.requiredroles.includes(r.id))
    ) {
      let embedroles = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:requiredroles.title', { emoji: emojis.emojierror })}`)
        .setDescription(
          `${t('commands:requiredroles.description', {
            emoji: emojis.emojierror,
            emojiseta: emojis.emojisetinha,
            cargos:
              command && command.requiredroles
                ? command.requiredroles.map((v) => `<@&${v}>`).join(',')
                : `${t('commands:requiredroles.unknown')}`,
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedroles] })
    }

    if (
      command.alloweduserids &&
      command.alloweduserids.length > 0 &&
      !command.alloweduserids.includes(interaction.member.id)
    ) {
      let embedmembers = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:alloweduserids.title', { emoji: emojis.emojierror })}`)
        .setDescription(
          `${t('commands:alloweduserids.description', {
            emoji: emojis.emojierror,
            emojiseta: emojis.emojisetinha,
            users:
              command && command.alloweduserids
                ? command.alloweduserids.map((v) => `<@${v}>`).join(',')
                : `${t('commands:alloweduserids.unknown')}`,
          })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ ephemeral: true, embeds: [embedmembers] })
    }

    command.run({ client, interaction, prefix, color, emojis, language }, t)
    var numusosbot = cliente.commanduses
    numusosbot = numusosbot + 1

    await client.database.cliente.findOneAndUpdate({ _id: client.user.id }, { $set: { commanduses: numusosbot } })

    timestamps.set(interaction.member.id, now)
    setTimeout(() => timestamps.delete(interaction.member.id), cooldownAmount)

    const Webhook = new WebhookClient({
      id: config.webhook.id,
      token: config.webhook.token,
    })

    const EMBED_COMMANDS = new MessageEmbed()
      .setAuthor(`Logs de Comandos do Bot`, client.user.displayAvatarURL())
      .addFields(
        {
          name: `Servidor que foi Usado`,
          value: `**${interaction.guild.name}** \`( ${interaction.guild.id} )\``,
        },
        {
          name: `Author do Comando`,
          value: `**${interaction.member.user.tag}** \`( ${interaction.member.id} )\``,
        },
        {
          name: `Data da Execução`,
          value: moment(Date.now()).format('L LT'),
        },
        {
          name: `Comando Executado`,
          value: `**\`${command.name}\`**`,
        }
      )
      .setTimestamp()
      .setColor(config.color)
      .setFooter(interaction.member.id, interaction.member.user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(client.user.displayAvatarURL({ format: 'jpg', size: 2048 }))
    Webhook.send({ embeds: [EMBED_COMMANDS] })
  }
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
