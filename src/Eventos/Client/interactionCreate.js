const { PermissionsBitField, WebhookClient, InteractionType, Client, CommandInteraction, EmbedBuilder } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const emojis = require('../../Interfaces/emojis.json')
const { getPrefix } = require('../../Struturas/Functions')
const moment = require('moment')
moment.locale('pt-BR')
let t
const coldoown = new Set();

module.exports ={
  name: "interactionCreate",
  /**
  * 
  * @param {Client} client 
  * @param {CommandInteraction} interaction 
  */
  run: async (client, interaction) => {

    const prefix = await getPrefix(interaction.guild.id, client)

    if (interaction.type === InteractionType.ApplicationCommand) {

      const SlashCommands = client.slashCommands.get(interaction.commandName);
      if (!SlashCommands) return;

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

      if (SlashCommands) {

        const cooldownAmount = (SlashCommands.cooldown || 3) * 1000

        if(coldoown.has(interaction.member.id)) {
          let embedtime = new EmbedSay(interaction.member.user, t)
              .setDescription(
                `${t('commands:cooldown.message', {
                  emoji: emojis.emojitempo,
                  membro: interaction.member,
                  comando: SlashCommands.name,
                })}`
              )
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          return interaction.reply({ ephemeral: true, embeds: [embedtime] })
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
            !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
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

        if (cmdss.some((x) => x === SlashCommands.name)) {
          return interaction.reply({
            ephemeral: true,
            content: `${t('commands:cmdblockk.message', { emoji: emojis.emojierror, membro: interaction.member })}`,
          })
        }

        if (commandsdj.length && commandsdj.includes(SlashCommands.name)) {
          let temdj = false
          let rolesdj
          const player = client.manager.players.get(interaction.guild.id)

          for (let i = 0; i < djroles.length; i++) {
            if (interaction.member.roles.cache.has(djroles[i])) temdj = true
            if (!interaction.guild.roles.cache.get(djroles[i])) continue
            rolesdj += '<@&' + djroles[i] + '> | '
          }

          if (!temdj && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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

        let permszinha_membro = PermissionsBitField.resolve(SlashCommands.memberperm)
        let permszinha_client = PermissionsBitField.resolve(SlashCommands.clientperm)

        if (SlashCommands.memberperm && !interaction.member.permissions.has(permszinha_membro)) {
          let permissions = []
      
          if (SlashCommands.memberperm.includes("Administrator"))
          permissions.push(`${t('commands:perms.ADMINISTRATOR')}`)
        if (SlashCommands.memberperm.includes("ViewAuditLog"))
          permissions.push(`${t('commands:perms.VIEW_AUDIT_LOG')}`)
        if (SlashCommands.memberperm.includes("ManageGuild"))
          permissions.push(`${t('commands:perms.MANAGE_GUILD')}`)
        if (SlashCommands.memberperm.includes("ManageRoles"))
          permissions.push(`${t('commands:perms.MANAGE_ROLES')}`)
        if (SlashCommands.memberperm.includes("ManageChannels"))
          permissions.push(`${t('commands:perms.MANAGE_CHANNELS')}`)
        if (SlashCommands.memberperm.includes("KickMembers"))
          permissions.push(`${t('commands:perms.KICK_MEMBERS')}`)
        if (SlashCommands.memberperm.includes("BanMembers"))
          permissions.push(`${t('commands:perms.BAN_MEMBERS')}`)
        if (SlashCommands.memberperm.includes("CreateInstantInvite"))
          permissions.push(`${t('commands:perms.CREATE_INSTANT_INVITE')}`)
        if (SlashCommands.memberperm.includes("ChangeNickname"))
          permissions.push(`${t('commands:perms.CHANGE_NICKNAME')}`)
        if (SlashCommands.memberperm.includes("ManageNicknames"))
          permissions.push(`${t('commands:perms.MANAGE_NICKNAMES')}`)
        if (SlashCommands.memberperm.includes("ManageEmojisAndStickers"))
          permissions.push(`${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
        if (SlashCommands.memberperm.includes("ManageWebhooks"))
          permissions.push(`${t('commands:perms.MANAGE_WEBHOOKS')}`)
        if (SlashCommands.memberperm.includes("ViewChannel"))
          permissions.push(`${t('commands:perms.VIEW_CHANNEL')}`)
        if (SlashCommands.memberperm.includes("SendMessages"))
          permissions.push(`${t('commands:perms.SEND_MESSAGES')}`)
        if (SlashCommands.memberperm.includes("SendTTSMessages"))
          permissions.push(`${t('commands:perms.SEND_TTS_MESSAGES')}`)
        if (SlashCommands.memberperm.includes("ManageMessages"))
          permissions.push(`${t('commands:perms.MANAGE_MESSAGES')}`)
        if (SlashCommands.memberperm.includes("EmbedLinks"))
          permissions.push(`${t('commands:perms.EMBED_LINKS')}`)
        if (SlashCommands.memberperm.includes("AttachFiles"))
          permissions.push(`${t('commands:perms.ATTACH_FILES')}`)
        if (SlashCommands.memberperm.includes("ReadMessageHistory"))
          permissions.push(`${t('commands:perms.READ_MESSAGE_HISTORY')}`)
        if (SlashCommands.memberperm.includes("MentionEveryone"))
          permissions.push(`${t('commands:perms.MENTION_EVERYONE')}`)
        if (SlashCommands.memberperm.includes("UseExternalEmojis"))
          permissions.push(`${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
        if (SlashCommands.memberperm.includes("AddReactions"))
          permissions.push(`${t('commands:perms.ADD_REACTIONS')}`)
        if (SlashCommands.memberperm.includes("Connect")) permissions.push(`${t('commands:perms.CONNECT')}`)
        if (SlashCommands.memberperm.includes("Speak")) permissions.push(`${t('commands:perms.SPEAK')}`)
        if (SlashCommands.memberperm.includes("Stream")) permissions.push(`${t('commands:perms.STREAM')}`)
        if (SlashCommands.memberperm.includes("MuteMembers"))
          permissions.push(`${t('commands:perms.MUTE_MEMBERS')}`)
        if (SlashCommands.memberperm.includes("DeafenMembers"))
          permissions.push(`${t('commands:perms.DEAFEN_MEMBERS')}`)
        if (SlashCommands.memberperm.includes("MoveMembers"))
          permissions.push(`${t('commands:perms.MOVE_MEMBERS')}`)
        if (SlashCommands.memberperm.includes("UseVAD")) permissions.push(`${t('commands:perms.USE_VAD')}`)
        if (SlashCommands.memberperm.includes("PrioritySpeaker"))
          permissions.push(`${t('commands:perms.PRIORITY_SPEAKER')}`)
        if (SlashCommands.memberperm.includes("ViewGuildInsights"))
          permissions.push(`${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
        if (SlashCommands.memberperm.includes("UseApplicationCommands"))
          permissions.push(`${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
        if (SlashCommands.memberperm.includes("RequestToSpeak"))
          permissions.push(`${t('commands:perms.REQUEST_TO_SPEAK')}`)
        if (SlashCommands.memberperm.includes("ManageThreads"))
          permissions.push(`${t('commands:perms.MANAGE_THREADS')}`)
        if(SlashCommands.memberperm.includes("ModerateMembers"))
          permissions.push(`${t('commands:perms.MODERATE_MEMBERS')}`)
        if(SlashCommands.memberperm.includes("UseEmbeddedActivities"))
          permissions.push(`${t('commands:perms.START_EMBEDDED_ACTIVITIES')}`)
        if(SlashCommands.memberperm.includes("SendMessagesInThreads"))
          permissions.push(`${t('commands:perms.SEND_MESSAGES_IN_THREADS')}`)
        if(SlashCommands.memberperm.includes("UseExternalStickers"))
          permissions.push(`${t('commands:perms.USE_EXTERNAL_STICKERS')}`)
        if(SlashCommands.memberperm.includes("CreatePublicThreads"))
          permissions.push(`${t('commands:perms.CREATE_PUBLIC_THREADS')}`)
        if(SlashCommands.memberperm.includes("CreatePrivateThreads"))
          permissions.push(`${t('commands:perms.CREATE_PRIVATE_THREADS')}`)

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
          interaction.reply({ ephemeral: true, embeds: [embedperms] })
          permissions = []
          return
        }

        if (
          SlashCommands.clientperm &&
          !interaction.guild.members.cache.get(client.user.id).permissions.has(permszinha_client)
        ) {
          let permissions = []

          if (SlashCommands.clientperm.includes("Administrator"))
            permissions.push(`${t('commands:perms.ADMINISTRATOR')}`)
          if (SlashCommands.clientperm.includes("ViewAuditLog"))
            permissions.push(`${t('commands:perms.VIEW_AUDIT_LOG')}`)
          if (SlashCommands.clientperm.includes("ManageGuild"))
            permissions.push(`${t('commands:perms.MANAGE_GUILD')}`)
          if (SlashCommands.clientperm.includes("ManageRoles"))
            permissions.push(`${t('commands:perms.MANAGE_ROLES')}`)
          if (SlashCommands.clientperm.includes("ManageChannels"))
            permissions.push(`${t('commands:perms.MANAGE_CHANNELS')}`)
          if (SlashCommands.clientperm.includes("KickMembers"))
            permissions.push(`${t('commands:perms.KICK_MEMBERS')}`)
          if (SlashCommands.clientperm.includes("BanMembers"))
            permissions.push(`${t('commands:perms.BAN_MEMBERS')}`)
          if (SlashCommands.clientperm.includes("CreateInstantInvite"))
            permissions.push(`${t('commands:perms.CREATE_INSTANT_INVITE')}`)
          if (SlashCommands.clientperm.includes("ChangeNickname"))
            permissions.push(`${t('commands:perms.CHANGE_NICKNAME')}`)
          if (SlashCommands.clientperm.includes("ManageNicknames"))
            permissions.push(`${t('commands:perms.MANAGE_NICKNAMES')}`)
          if (SlashCommands.clientperm.includes("ManageEmojisAndStickers"))
            permissions.push(`${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
          if (SlashCommands.clientperm.includes("ManageWebhooks"))
            permissions.push(`${t('commands:perms.MANAGE_WEBHOOKS')}`)
          if (SlashCommands.clientperm.includes("ViewChannel"))
            permissions.push(`${t('commands:perms.VIEW_CHANNEL')}`)
          if (SlashCommands.clientperm.includes("SendMessages"))
            permissions.push(`${t('commands:perms.SEND_MESSAGES')}`)
          if (SlashCommands.clientperm.includes("SendTTSMessages"))
            permissions.push(`${t('commands:perms.SEND_TTS_MESSAGES')}`)
          if (SlashCommands.clientperm.includes("ManageMessages"))
            permissions.push(`${t('commands:perms.MANAGE_MESSAGES')}`)
          if (SlashCommands.clientperm.includes("EmbedLinks"))
            permissions.push(`${t('commands:perms.EMBED_LINKS')}`)
          if (SlashCommands.clientperm.includes("AttachFiles"))
            permissions.push(`${t('commands:perms.ATTACH_FILES')}`)
          if (SlashCommands.clientperm.includes("ReadMessageHistory"))
            permissions.push(`${t('commands:perms.READ_MESSAGE_HISTORY')}`)
          if (SlashCommands.clientperm.includes("MentionEveryone"))
            permissions.push(`${t('commands:perms.MENTION_EVERYONE')}`)
          if (SlashCommands.clientperm.includes("UseExternalEmojis"))
            permissions.push(`${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
          if (SlashCommands.clientperm.includes("AddReactions"))
            permissions.push(`${t('commands:perms.ADD_REACTIONS')}`)
          if (SlashCommands.clientperm.includes("Connect")) permissions.push(`${t('commands:perms.CONNECT')}`)
          if (SlashCommands.clientperm.includes("Speak")) permissions.push(`${t('commands:perms.SPEAK')}`)
          if (SlashCommands.clientperm.includes("Stream")) permissions.push(`${t('commands:perms.STREAM')}`)
          if (SlashCommands.clientperm.includes("MuteMembers"))
            permissions.push(`${t('commands:perms.MUTE_MEMBERS')}`)
          if (SlashCommands.clientperm.includes("DeafenMembers"))
            permissions.push(`${t('commands:perms.DEAFEN_MEMBERS')}`)
          if (SlashCommands.clientperm.includes("MoveMembers"))
            permissions.push(`${t('commands:perms.MOVE_MEMBERS')}`)
          if (SlashCommands.clientperm.includes("UseVAD")) permissions.push(`${t('commands:perms.USE_VAD')}`)
          if (SlashCommands.clientperm.includes("PrioritySpeaker"))
            permissions.push(`${t('commands:perms.PRIORITY_SPEAKER')}`)
          if (SlashCommands.clientperm.includes("ViewGuildInsights"))
            permissions.push(`${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
          if (SlashCommands.clientperm.includes("UseApplicationCommands"))
            permissions.push(`${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
          if (SlashCommands.clientperm.includes("RequestToSpeak"))
            permissions.push(`${t('commands:perms.REQUEST_TO_SPEAK')}`)
          if (SlashCommands.clientperm.includes("ManageThreads"))
            permissions.push(`${t('commands:perms.MANAGE_THREADS')}`)
          if(SlashCommands.clientperm.includes("ModerateMembers"))
            permissions.push(`${t('commands:perms.MODERATE_MEMBERS')}`)
          if(SlashCommands.clientperm.includes("UseEmbeddedActivities"))
            permissions.push(`${t('commands:perms.START_EMBEDDED_ACTIVITIES')}`)
          if(SlashCommands.clientperm.includes("SendMessagesInThreads"))
            permissions.push(`${t('commands:perms.SEND_MESSAGES_IN_THREADS')}`)
          if(SlashCommands.clientperm.includes("UseExternalStickers"))
            permissions.push(`${t('commands:perms.USE_EXTERNAL_STICKERS')}`)
          if(SlashCommands.clientperm.includes("CreatePublicThreads"))
            permissions.push(`${t('commands:perms.CREATE_PUBLIC_THREADS')}`)
          if(SlashCommands.clientperm.includes("CreatePrivateThreads"))
            permissions.push(`${t('commands:perms.CREATE_PRIVATE_THREADS')}`)

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
          SlashCommands.requiredroles &&
          SlashCommands.requiredroles.length > 0 &&
          interaction.member.roles.cache.size > 0 &&
          !interaction.member.roles.cache.some((r) => SlashCommands.requiredroles.includes(r.id))
        ) {
          let embedroles = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:requiredroles.title', { emoji: emojis.emojierror })}`)
            .setDescription(
              `${t('commands:requiredroles.description', {
                emoji: emojis.emojierror,
                emojiseta: emojis.emojisetinha,
                cargos:
                  command && SlashCommands.requiredroles
                    ? SlashCommands.requiredroles.map((v) => `<@&${v}>`).join(',')
                    : `${t('commands:requiredroles.unknown')}`,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          return interaction.reply({ ephemeral: true, embeds: [embedroles] })
        }

        if (
          SlashCommands.alloweduserids &&
          SlashCommands.alloweduserids.length > 0 &&
          !SlashCommands.alloweduserids.includes(interaction.member.id)
        ) {
          let embedmembers = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:alloweduserids.title', { emoji: emojis.emojierror })}`)
            .setDescription(
              `${t('commands:alloweduserids.description', {
                emoji: emojis.emojierror,
                emojiseta: emojis.emojisetinha,
                users:
                  command && SlashCommands.alloweduserids
                    ? SlashCommands.alloweduserids.map((v) => `<@${v}>`).join(',')
                    : `${t('commands:alloweduserids.unknown')}`,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          return interaction.reply({ ephemeral: true, embeds: [embedmembers] })
        }

        SlashCommands.run({ client, interaction, prefix, color, emojis, language }, t)
        var numusosbot = cliente.commanduses
        numusosbot = numusosbot + 1

        await client.database.cliente.findOneAndUpdate({ _id: client.user.id }, { $set: { commanduses: numusosbot } })

        if (!["469661232153231385"].includes(interaction.member.id)) {
          coldoown.add(interaction.member.id);
          setTimeout(() => {
            coldoown.delete(interaction.member.id);
          }, cooldownAmount);
        }

        const Webhook = new WebhookClient({
          id: config.webhook.id,
          token: config.webhook.token,
        })

        const EMBED_COMMANDS = new EmbedBuilder()
          .setAuthor({ name: `Logs de Comandos do Bot`, iconURL: client.user.displayAvatarURL() })
          .addFields([
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
              value: `<t:${Math.round(Date.now() / 1000)}:f> ( <t:${Math.round(Date.now() / 1000)}:R> )`,
            },
            {
              name: `Comando Executado`,
              value: `**\`${SlashCommands.name}\`**`,
            }
          ])
          .setTimestamp()
          .setColor(config.color)
          .setFooter({ text: `${interaction.member.id}`, iconURL: interaction.member.user.displayAvatarURL({ dynamic: true }) })
          .setThumbnail(client.user.displayAvatarURL({ format: 'jpg', size: 2048 }))
        Webhook.send({ embeds: [EMBED_COMMANDS] })
      }
    }
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
