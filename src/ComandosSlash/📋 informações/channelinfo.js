const { PermissionsBitField, ButtonBuilder, ButtonStyle, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType, version } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'channelinfo',
  description: 'Exibe as informações sobre o canal citado',
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
      name: "qual_canal",
      description: "Qual canal deseja exibir informações no servidor?",
      type: ApplicationCommandOptionType.Channel,
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

    const channelMention = options.getChannel('qual_canal')

    if (channelMention) {
      const typecountes = {
        2: `${t('commands:channelinfo:typecountes.GUILD_VOICE')}`,
        0: `${t('commands:channelinfo:typecountes.GUILD_TEXT')}`,
        4: `${t('commands:channelinfo:typecountes.GUILD_CATEGORY')}`,
        5: `${t('commands:channelinfo:typecountes.GUILD_NEWS')}`,
        10: `${t('commands:channelinfo:typecountes.GUILD_NEWS_THREAD')}`,
        11: `${t('commands:channelinfo:typecountes.GUILD_PUBLIC_THREAD')}`,
        12: `${t('commands:channelinfo:typecountes.GUILD_PRIVATE_THREAD')}`,
        13: `${t('commands:channelinfo:typecountes.GUILD_STAGE_VOICE')}`,
      }

      let embedchannelinfo = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:channelinfo:embed.title', { emoji: emojis.emojirobo, channel: channelMention.name })}`)
        .addFields([
          {
            name: `${t('commands:channelinfo:embed.filed1name', { emoji: emojis.emojisetinha })}`,
            value: `\`${channelMention.name}\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed2name', { emoji: emojis.emojisetinha })}`,
            value: `\`${channelMention.id}\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed3name', { emoji: emojis.emojisetinha })}`,
            value: `\`${typecountes[channelMention.type]}\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed4name', { emoji: emojis.emojisetinha })}`,
            value: `<t:${Math.round(channelMention.createdAt / 1000)}:F> ( <t:${Math.round(
              channelMention.createdAt / 1000
            )}:R> )`,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed5name', { emoji: emojis.emojisetinha })}`,
            value: `\`${channelMention.rawPosition}\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed6name', { emoji: emojis.emojisetinha })}`,
            value: `\`${channelMention.topic || `${t('commands:channelinfo:embed.notpossui')}`}\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed7name', { emoji: emojis.emojisetinha })}`,
            value: `${channelMention.nsfw ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed8name', { emoji: emojis.emojisetinha })}`,
            value: `\`${
              channelMention.rateLimitPerUser
                ? `${channelMention.rateLimitPerUser}`
                : `${t('commands:channelinfo:embed.notpossui')}`
            }\``,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed9name', { emoji: emojis.emojisetinha })}`,
            value: `**${
              channelMention.parentId ? `<#${channelMention.parentId}>` : `${t('commands:channelinfo:embed.notpossui')}`
            }**`,
            inline: true,
          },
          {
            name: `${t('commands:channelinfo:embed.filed10name', { emoji: emojis.emojisetinha })}`,
            value: `${channelMention.viewable ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
            inline: true,
          }
        ])
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      interaction.reply({ embeds: [embedchannelinfo] })
    }
  },
}
