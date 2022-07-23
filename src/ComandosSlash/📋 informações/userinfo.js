const { PermissionsBitField, ButtonBuilder, ButtonStyle, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'userinfo',
  description: 'Exibe as informações de um usuário',
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
      name: "id_membro",
      description: "Qual membro deseja pegar o avatar pelo id?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "membro",
      description: "Qual membro deseja pegar o avatar?",
      type: ApplicationCommandOptionType.User,
      required: false,
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

    const idmember = options.getString('id_membro')
    const membrooo = options.getUser('membro')

    if (idmember && !membrooo) {
      const realMember = await client.users.fetch(idmember)

      if (!realMember) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:userinfo:errormember', { emoji: emojis.emojierror })}`,
        })
      }

      const embedUserinfo = new EmbedSay(interaction.member.user, t)
        .setTitle(
          `${t('commands:userinfo:embed.title', {
            emoji: emojis.emojiusers,
            membro: `${realMember.username}#${realMember.discriminator}`,
          })}`
        )
        .setThumbnail(realMember.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `${t('commands:userinfo:embed.desc', {
            emoji: emojis.emojicerto,
            emojis: emojis.emojisetinha,
            membro: `${realMember.username}#${realMember.discriminator}`,
            emojise: emojis.emojisetinha,
            id: realMember.id,
            emojiset: emojis.emojisetinha,
            time: `**<t:${Math.round(realMember.createdAt / 1000)}:F> ( <t:${Math.round(
              realMember.createdAt / 1000
            )}:R> )**`,
            emojiseta: emojis.emojisetinha,
            bot: realMember.bot == true ? `${emojis.emojiativo} Sim` : `${emojis.emojidesativo} Não`,
          })}`
        )
      return interaction.reply({ embeds: [embedUserinfo] })
    } else if (membrooo && !idmember) {
      const realMember = guild.members.cache.get(membrooo.id)

      if (!realMember) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:userinfo:errormember', { emoji: emojis.emojierror })}`,
        })
      }

      const embedUserinfo = new EmbedSay(interaction.member.user, t)
        .setTitle(
          `${t('commands:userinfo:embed.title', {
            emoji: emojis.emojiusers,
            membro: `${realMember.user.username}#${realMember.user.discriminator}`,
          })}`
        )
        .setThumbnail(realMember.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `${t('commands:userinfo:embed.desc', {
            emoji: emojis.emojicerto,
            emojis: emojis.emojisetinha,
            membro: `${realMember.user.username}#${realMember.user.discriminator}`,
            emojise: emojis.emojisetinha,
            id: realMember.user.id,
            emojiset: emojis.emojisetinha,
            time: `**<t:${Math.round(realMember.user.createdAt / 1000)}:F> ( <t:${Math.round(
              realMember.user.createdAt / 1000
            )}:R> )**`,
            emojiseta: emojis.emojisetinha,
            bot: realMember.user.bot == true ? `${emojis.emojiativo} Sim` : `${emojis.emojidesativo} Não`,
          })}`
        )
      return interaction.reply({ embeds: [embedUserinfo] })
    } else {
      const realMember = guild.members.cache.get(member.id)

      const embedUserinfo = new EmbedSay(interaction.member.user, t)
        .setTitle(
          `${t('commands:userinfo:embed.title', {
            emoji: emojis.emojiusers,
            membro: `${realMember.user.username}#${realMember.user.discriminator}`,
          })}`
        )
        .setThumbnail(realMember.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `${t('commands:userinfo:embed.desc', {
            emoji: emojis.emojicerto,
            emojis: emojis.emojisetinha,
            membro: `${realMember.user.username}#${realMember.user.discriminator}`,
            emojise: emojis.emojisetinha,
            id: realMember.user.id,
            emojiset: emojis.emojisetinha,
            time: `**<t:${Math.round(realMember.user.createdAt / 1000)}:F> ( <t:${Math.round(
              realMember.user.createdAt / 1000
            )}:R> )**`,
            emojiseta: emojis.emojisetinha,
            bot: realMember.user.bot == true ? `${emojis.emojiativo} Sim` : `${emojis.emojidesativo} Não`,
          })}`
        )
      return interaction.reply({ embeds: [embedUserinfo] })
    }
  },
}
