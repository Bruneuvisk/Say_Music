const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'roleinfo',
  description: '[📋] Exibe as informações sobre um cargo citado',
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
      name: "qual_cargo",
      description: "Qual cargo deseja exibir informações no servidor?",
      type: ApplicationCommandOptionType.Role,
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

    const roleMention = options.getRole('qual_cargo')

    let permisizn = roleMention.permissions
      .toArray()
      .map((p) => `\`${p}\``)
      .join(', ')
      .replace('CreateInstantInvite', `${t('commands:perms.CREATE_INSTANT_INVITE')}`)
      .replace('KickMembers', `${t('commands:perms.KICK_MEMBERS')}`)
      .replace('BanMembers', `${t('commands:perms.BAN_MEMBERS')}`)
      .replace('Administrator', `${t('commands:perms.ADMINISTRATOR')}`)
      .replace('ManageChannels', `${t('commands:perms.MANAGE_CHANNELS')}`)
      .replace('ManageGuild', `${t('commands:perms.MANAGE_GUILD')}`)
      .replace('AddReactions', `${t('commands:perms.ADD_REACTIONS')}`)
      .replace('ViewAuditLog', `${t('commands:perms.VIEW_AUDIT_LOG')}`)
      .replace('PrioritySpeaker', `${t('commands:perms.PRIORITY_SPEAKER')}`)
      .replace('Stream', `${t('commands:perms.STREAM')}`)
      .replace('ViewChannel', `${t('commands:perms.VIEW_CHANNEL')}`)
      .replace('SendMessages', `${t('commands:perms.SEND_MESSAGES')}`)
      .replace('SendTTSMessages', `${t('commands:perms.SEND_TTS_MESSAGES')}`)
      .replace('ManageMessages', `${t('commands:perms.MANAGE_MESSAGES')}`)
      .replace('EmbedLinks', `${t('commands:perms.EMBED_LINKS')}`)
      .replace('AttachFiles', `${t('commands:perms.ATTACH_FILES')}`)
      .replace('ReadMessageHistory', `${t('commands:perms.READ_MESSAGE_HISTORY')}`)
      .replace('MentionEveryone', `${t('commands:perms.MENTION_EVERYONE')}`)
      .replace('UseExternalEmojis', `${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
      .replace('ViewGuildInsights', `${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
      .replace('Connect', `${t('commands:perms.CONNECT')}`)
      .replace('Speak', `${t('commands:perms.SPEAK')}`)
      .replace('MuteMembers', `${t('commands:perms.MUTE_MEMBERS')}`)
      .replace('DeafenMembers', `${t('commands:perms.DEAFEN_MEMBERS')}`)
      .replace('MoveMembers', `${t('commands:perms.MOVE_MEMBERS')}`)
      .replace('UseVAD', `${t('commands:perms.USE_VAD')}`)
      .replace('ChangeNickname', `${t('commands:perms.CHANGE_NICKNAME')}`)
      .replace('ManageNicknames', `${t('commands:perms.MANAGE_NICKNAMES')}`)
      .replace('ManageRoles', `${t('commands:perms.MANAGE_ROLES')}`)
      .replace('ManageWebhooks', `${t('commands:perms.MANAGE_WEBHOOKS')}`)
      .replace('ManageEmojisAndStickers', `${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
      .replace('UseApplicationCommands', `${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
      .replace('RequestToSpeak', `${t('commands:perms.REQUEST_TO_SPEAK')}`)
      .replace('ManageThreads', `${t('commands:perms.MANAGE_THREADS')}`)
      .replace('UseExternalStickers', `${t('commands:perms.USE_EXTERNAL_STICKERS')}`)
      .replace('CreatePublicThreads', `${t('commands:perms.CREATE_PUBLIC_THREADS')}`)
      .replace('CreatePrivateThreads', `${t('commands:perms.CREATE_PRIVATE_THREADS')}`)
      .replace('SendMessagesInThreads', `${t('commands:perms.SEND_MESSAGES_IN_THREADS')}`)
      .replace('UseEmbeddedActivities', `${t('commands:perms.START_EMBEDDED_ACTIVITIES')}`)
      .replace('ModerateMembers', `${t('commands:perms.MODERATE_MEMBERS')}`)

    let embedroleinfo = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:roleinfo:embed.title', { emoji: emojis.emojirobo, cargo: roleMention.name })}`)
      .addFields([
        {
          name: `${t('commands:roleinfo:embed.filed1name', { emoji: emojis.emojisetinha })}`,
          value: `\`${roleMention.name}\``,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed2name', { emoji: emojis.emojisetinha })}`,
          value: `\`${roleMention.id}\``,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed3name', { emoji: emojis.emojisetinha })}`,
          value: `\`${roleMention.hexColor}\``,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed4name', { emoji: emojis.emojisetinha })}`,
          value: `<t:${Math.round(roleMention.createdAt / 1000)}:F> ( <t:${Math.round(
            roleMention.createdAt / 1000
          )}:R> )`,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed5name', { emoji: emojis.emojisetinha })}`,
          value: `\`${roleMention.rawPosition}\``,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed6name', { emoji: emojis.emojisetinha })}`,
          value: `\`${roleMention.members.size}\``,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed7name', { emoji: emojis.emojisetinha })}`,
          value: `${roleMention.hoist ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed8name', { emoji: emojis.emojisetinha })}`,
          value: `${roleMention.mentionable ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed9name', { emoji: emojis.emojisetinha })}`,
          value: `${roleMention.managed ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
          inline: true,
        },
        {
          name: `${t('commands:roleinfo:embed.filed10name', { emoji: emojis.emojisetinha })}`,
          value: `${permisizn}`,
          inline: false,
        }
      ])
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    interaction.reply({ embeds: [embedroleinfo] })
  },
}
