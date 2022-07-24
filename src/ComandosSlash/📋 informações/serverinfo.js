const { PermissionsBitField, ButtonBuilder, ButtonStyle, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType, ChannelType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

const levelbooster = {
  0: '**0**',
  1: '**1**',
  2: '**2**',
  3: '**3**',
}

module.exports = {
  name: 'serverinfo',
  description: '[📋] Exibe as informações sobre o servidor no qual foi feito o comando',
  cooldown: 5,
  memberperm: ['SendMessages', 'UseApplicationCommands'],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [],
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

    const filterregions = {
      'en-US': `${t('commands:serverinfo:utils:filterregions.en-US')}`,
      'en-GB': `${t('commands:serverinfo:utils:filterregions.en-GB')}`,
      'zh-CN': `${t('commands:serverinfo:utils:filterregions.zh-CN')}`,
      'zh-TW': `${t('commands:serverinfo:utils:filterregions.zh-TW')}`,
      cs: `${t('commands:serverinfo:utils:filterregions.cs')}`,
      da: `${t('commands:serverinfo:utils:filterregions.da')}`,
      nl: `${t('commands:serverinfo:utils:filterregions.nl')}`,
      fr: `${t('commands:serverinfo:utils:filterregions.fr')}`,
      de: `${t('commands:serverinfo:utils:filterregions.de')}`,
      el: `${t('commands:serverinfo:utils:filterregions.el')}`,
      hu: `${t('commands:serverinfo:utils:filterregions.hu')}`,
      it: `${t('commands:serverinfo:utils:filterregions.it')}`,
      ja: `${t('commands:serverinfo:utils:filterregions.ja')}`,
      ko: `${t('commands:serverinfo:utils:filterregions.ko')}`,
      no: `${t('commands:serverinfo:utils:filterregions.no')}`,
      pl: `${t('commands:serverinfo:utils:filterregions.pl')}`,
      'pt-BR': `${t('commands:serverinfo:utils:filterregions.pt-BR')}`,
      ru: `${t('commands:serverinfo:utils:filterregions.ru')}`,
      'es-ES': `${t('commands:serverinfo:utils:filterregions.es-ES')}`,
      'sv-SE': `${t('commands:serverinfo:utils:filterregions.sv-SE')}`,
      tr: `${t('commands:serverinfo:utils:filterregions.tr')}`,
      bg: `${t('commands:serverinfo:utils:filterregions.bg')}`,
      uk: `${t('commands:serverinfo:utils:filterregions.uk')}`,
      fi: `${t('commands:serverinfo:utils:filterregions.fi')}`,
      hr: `${t('commands:serverinfo:utils:filterregions.hr')}`,
      ro: `${t('commands:serverinfo:utils:filterregions.ro')}`,
      lt: `${t('commands:serverinfo:utils:filterregions.lt')}`,
    }

    const verificationLevels = {
      0: `${t('commands:serverinfo:utils:verification.NONE')}`,
      1: `${t('commands:serverinfo:utils:verification.LOW')}`,
      2: `${t('commands:serverinfo:utils:verification.MEDIUM')}`,
      3: `${t('commands:serverinfo:utils:verification.HIGH')}`,
      4: `${t('commands:serverinfo:utils:verification.VERY_HIGH')}`,
    }

    const filterLevels = {
      0: `${t('commands:serverinfo:utils:filterLevels.DISABLED')}`,
      1: `${t('commands:serverinfo:utils:filterLevels.MEMBERS_WITHOUT_ROLES')}`,
      2: `${t('commands:serverinfo:utils:filterLevels.ALL_MEMBERS')}`,
    }

    const mfalevels = {
      0: `${t('commands:serverinfo:utils:mfalevels.NONE')}`,
      1: `${t('commands:serverinfo:utils:mfalevels.ELEVATED')}`,
    }

    const nsfwlevels = {
      0: `${t('commands:serverinfo:utils:nsfwlevels.DEFAULT')}`,
      1: `${t('commands:serverinfo:utils:nsfwlevels.EXPLICIT')}`,
      2: `${t('commands:serverinfo:utils:nsfwlevels.SAFE')}`,
      3: `${t('commands:serverinfo:utils:nsfwlevels.AGE_RESTRICTED')}`,
    }

    let memberowner = guild.members.cache.get(guild.ownerId)
    let emojianimado = guild.emojis.cache.filter((m) => m.animated == true).size
    let emojinonanimedo = guild.emojis.cache.filter((m) => m.animated == false).size
    let stickers = guild.stickers.cache.size
    let guildUrl = guild.iconURL({ dynamic: true, size: 2048 })
    let roles_ = []
    await rolesServer(roles_, interaction, t)

    const embedAwait = new EmbedSay(interaction.member.user, t).setDescription(
      `${t('commands:serverinfo:embedinfo.waitmessage', { emoji: emojis.emojicarregando })}`
    )

    await interaction.reply({ embeds: [embedAwait] })

    if (interaction.guild.banner == null) {
      setTimeout(() => {
        const guildEmbed = new EmbedSay(interaction.member.user, t)
          .setAuthor({ name: `${t('commands:serverinfo:embedinfo.title', { guild: guild.name })}`, iconURL: guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl, url: guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl })
          .setDescription(
            `${t('commands:serverinfo:embedinfo.desc', {
              emoji: emojis.emojicerto,
              emojiseta: emojis.emojisetinha,
              name: guild.name,
              id: guild.id,
              idmembro: memberowner.id,
              region: filterregions[guild.preferredLocale],
              levelbooster: levelbooster[guild.premiumTier],
              filterlevel: filterLevels[guild.explicitContentFilter],
              verilevels: verificationLevels[guild.verificationLevel],
              nsfwlevel: nsfwlevels[guild.nsfwLevel],
              mfalevel: mfalevels[guild.mfaLevel],
              createdate: `<t:${Math.round(guild.createdAt / 1000)}:F> ( <t:${Math.round(guild.createdAt / 1000)}:R> )`,
              joindate: `<t:${Math.round(member.joinedAt / 1000)}:F> ( <t:${Math.round(member.joinedAt / 1000)}:R> )`,
              emojilista: emojis.emojilista,
              rolesize: guild.roles.cache.size,
              channelsize: guild.channels.cache.size,
              textsize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildText).size,
              voicesize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildVoice).size,
              categorysize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildCategory).size,
              emojisize: guild.emojis.cache.size,
              animatedemoji: emojianimado,
              emojinot: emojinonanimedo,
              sticker: stickers,
              membercount: guild.memberCount,
              botsize: guild.members.cache.filter((m) => m.user.bot == true).size,
              humanosize: guild.members.cache.filter((m) => m.user.bot == false).size,
              boostercount: guild.premiumSubscriptionCount,
              rolesreal: roles_,
            })}`
          )
          .setThumbnail(
            guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl,
            guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl
          )
        interaction.editReply({ embeds: [guildEmbed] })
      }, 8000)
    } else {
      setTimeout(() => {
        const guildEmbed = new EmbedSay(interaction.member.user, t)
          .setAuthor({  name: `${t('commands:serverinfo:embedinfo.title', { guild: guild.name })}`, iconURL: guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl, url: guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl })
          .setDescription(
            `${t('commands:serverinfo:embedinfo.desc', {
              emoji: emojis.emojicerto,
              emojiseta: emojis.emojisetinha,
              name: guild.name,
              id: guild.id,
              idmembro: memberowner.id,
              region: filterregions[guild.preferredLocale],
              levelbooster: levelbooster[guild.premiumTier],
              filterlevel: filterLevels[guild.explicitContentFilter],
              verilevels: verificationLevels[guild.verificationLevel],
              nsfwlevel: nsfwlevels[guild.nsfwLevel],
              mfalevel: mfalevels[guild.mfaLevel],
              createdate: `<t:${Math.round(guild.createdAt / 1000)}:F> ( <t:${Math.round(guild.createdAt / 1000)}:R> )`,
              joindate: `<t:${Math.round(member.joinedAt / 1000)}:F> ( <t:${Math.round(member.joinedAt / 1000)}:R> )`,
              emojilista: emojis.emojilista,
              rolesize: guild.roles.cache.size,
              channelsize: guild.channels.cache.size,
              textsize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildText).size,
              voicesize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildVoice).size,
              categorysize: guild.channels.cache.filter((x) => x.type == ChannelType.GuildCategory).size,
              emojisize: guild.emojis.cache.size,
              animatedemoji: emojianimado,
              emojinot: emojinonanimedo,
              sticker: stickers,
              membercount: guild.memberCount,
              botsize: guild.members.cache.filter((m) => m.user.bot == true).size,
              humanosize: guild.members.cache.filter((m) => m.user.bot == false).size,
              boostercount: guild.premiumSubscriptionCount,
              rolesreal: roles_,
            })}`
          )
          .setThumbnail(
            guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl,
            guildUrl == null ? interaction.member.user.displayAvatarURL({ dynamic: true }) : guildUrl
          )
          .setImage(guild.bannerURL({ size: 512 }))
        interaction.editReply({ embeds: [guildEmbed] })
      }, 8000)
    }
  },
}

async function rolesServer(roles, interaction, t) {
  const Role_Servidor = interaction.guild.roles.cache.filter((r) => r.id !== interaction.guild.id).map((roles) => roles)

  let list
  if (!Role_Servidor.length) list = `${t('commands:serverinfo:roleserver.nenhumcargo')}`
  else
    list =
      Role_Servidor.length > 10
        ? Role_Servidor.map((r) => r)
            .slice(0, 10)
            .join('\n') + `${t('commands:serverinfo:roleserver.cargoserver', { role: Role_Servidor.length - 10 })}`
        : Role_Servidor.map((r) => r).join('\n')

  roles.push(list)
}
