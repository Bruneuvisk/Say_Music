const { MessageEmbed, Permissions } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'channelinfo',
  description: 'Exibe as informações sobre o canal citado',
  cooldown: 5,
  memberperm: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_APPLICATION_COMMANDS],
  clientperm: [
    Permissions.FLAGS.EMBED_LINKS,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{"String": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    {
      Channel: { name: 'qual_canal', description: 'Qual canal deseja exibir informações no servidor?', required: true },
    }, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    /*{
      StringChoices: {
        name: 'qual_ping',
        description: 'Qual ping você quer saber sobre mim?',
        required: true,
        choices: [
          ['bot', 'botping'],
          ['Discord Api', 'discord_api'],
        ],
      },
    }*/ //, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
        GUILD_VOICE: `${t('commands:channelinfo:typecountes.GUILD_VOICE')}`,
        GUILD_TEXT: `${t('commands:channelinfo:typecountes.GUILD_TEXT')}`,
        GUILD_CATEGORY: `${t('commands:channelinfo:typecountes.GUILD_CATEGORY')}`,
        GUILD_NEWS: `${t('commands:channelinfo:typecountes.GUILD_NEWS')}`,
        GUILD_STORE: `${t('commands:channelinfo:typecountes.GUILD_STORE')}`,
        GUILD_NEWS_THREAD: `${t('commands:channelinfo:typecountes.GUILD_NEWS_THREAD')}`,
        GUILD_PUBLIC_THREAD: `${t('commands:channelinfo:typecountes.GUILD_PUBLIC_THREAD')}`,
        GUILD_PRIVATE_THREAD: `${t('commands:channelinfo:typecountes.GUILD_PRIVATE_THREAD')}`,
        GUILD_STAGE_VOICE: `${t('commands:channelinfo:typecountes.GUILD_STAGE_VOICE')}`,
        UNKNOWN: `${t('commands:channelinfo:typecountes.UNKNOWN')}`,
      }

      let embedchannelinfo = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:channelinfo:embed.title', { emoji: emojis.emojirobo, channel: channelMention.name })}`)
        .addFields(
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
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      interaction.reply({ embeds: [embedchannelinfo] })
    }
  },
}
