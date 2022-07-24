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
      .replace('CREATE_INSTANT_INVITE', `${t('commands:perms.CREATE_INSTANT_INVITE')}`)
      .replace('KICK_MEMBERS', `${t('commands:perms.KICK_MEMBERS')}`)
      .replace('BAN_MEMBERS', `${t('commands:perms.BAN_MEMBERS')}`)
      .replace('ADMINISTRATOR', `${t('commands:perms.ADMINISTRATOR')}`)
      .replace('MANAGE_CHANNELS', `${t('commands:perms.MANAGE_CHANNELS')}`)
      .replace('MANAGE_GUILD', `${t('commands:perms.MANAGE_GUILD')}`)
      .replace('ADD_REACTIONS', `${t('commands:perms.ADD_REACTIONS')}`)
      .replace('VIEW_AUDIT_LOG', `${t('commands:perms.VIEW_AUDIT_LOG')}`)
      .replace('PRIORITY_SPEAKER', `${t('commands:perms.PRIORITY_SPEAKER')}`)
      .replace('STREAM', `${t('commands:perms.STREAM')}`)
      .replace('VIEW_CHANNEL', `${t('commands:perms.VIEW_CHANNEL')}`)
      .replace('SEND_MESSAGES', `${t('commands:perms.SEND_MESSAGES')}`)
      .replace('SEND_TTS_MESSAGES', `${t('commands:perms.SEND_TTS_MESSAGES')}`)
      .replace('MANAGE_MESSAGES', `${t('commands:perms.MANAGE_MESSAGES')}`)
      .replace('EMBED_LINKS', `${t('commands:perms.EMBED_LINKS')}`)
      .replace('ATTACH_FILES', `${t('commands:perms.ATTACH_FILES')}`)
      .replace('READ_MESSAGE_HISTORY', `${t('commands:perms.READ_MESSAGE_HISTORY')}`)
      .replace('MENTION_EVERYONE', `${t('commands:perms.MENTION_EVERYONE')}`)
      .replace('USE_EXTERNAL_EMOJIS', `${t('commands:perms.USE_EXTERNAL_EMOJIS')}`)
      .replace('VIEW_GUILD_INSIGHTS', `${t('commands:perms.VIEW_GUILD_INSIGHTS')}`)
      .replace('CONNECT', `${t('commands:perms.CONNECT')}`)
      .replace('SPEAK', `${t('commands:perms.SPEAK')}`)
      .replace('MUTE_MEMBERS', `${t('commands:perms.MUTE_MEMBERS')}`)
      .replace('DEAFEN_MEMBERS', `${t('commands:perms.DEAFEN_MEMBERS')}`)
      .replace('MOVE_MEMBERS', `${t('commands:perms.MOVE_MEMBERS')}`)
      .replace('USE_VAD', `${t('commands:perms.USE_VAD')}`)
      .replace('CHANGE_NICKNAME', `${t('commands:perms.CHANGE_NICKNAME')}`)
      .replace('MANAGE_NICKNAMES', `${t('commands:perms.MANAGE_NICKNAMES')}`)
      .replace('MANAGE_ROLES', `${t('commands:perms.MANAGE_ROLES')}`)
      .replace('MANAGE_WEBHOOKS', `${t('commands:perms.MANAGE_WEBHOOKS')}`)
      .replace('MANAGE_EMOJIS_AND_STICKERS', `${t('commands:perms.MANAGE_EMOJIS_AND_STICKERS')}`)
      .replace('USE_APPLICATION_COMMANDS', `${t('commands:perms.USE_APPLICATION_COMMANDS')}`)
      .replace('REQUEST_TO_SPEAK', `${t('commands:perms.REQUEST_TO_SPEAK')}`)
      .replace('MANAGE_THREADS', `${t('commands:perms.MANAGE_THREADS')}`)
      .replace('USE_PUBLIC_THREADS', `${t('commands:perms.USE_PUBLIC_THREADS')}`)
      .replace('USE_PRIVATE_THREADS', `${t('commands:perms.USE_PRIVATE_THREADS')}`)
      .replace('USE_EXTERNAL_STICKERS', `${t('commands:perms.USE_EXTERNAL_STICKERS')}`)
      .replace('CREATE_PUBLIC_THREADS', `${t('commands:perms.CREATE_PUBLIC_THREADS')}`)
      .replace('CREATE_PRIVATE_THREADS', `${t('commands:perms.CREATE_PRIVATE_THREADS')}`)
      .replace('SEND_MESSAGES_IN_THREADS', `${t('commands:perms.SEND_MESSAGES_IN_THREADS')}`)
      .replace('START_EMBEDDED_ACTIVITIES', `${t('commands:perms.START_EMBEDDED_ACTIVITIES')}`)

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
