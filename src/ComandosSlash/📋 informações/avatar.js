const { PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'avatar',
  description: '[📋] Exibe o avatar de um membro',
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
    const membro = options.getUser('membro')

    if (idmember && !membro) {
      const realMember = await client.users.fetch(idmember)

      if (!realMember) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:avatar:errormessage', { emoji: emojis.emojierror })}`,
        })
      }

      const avatarURl = realMember.displayAvatarURL({
        dynamic: true,
        size: 2048,
      })

      let embedavatar = new EmbedSay(interaction.member.user, t)
        .setAuthor({ name: `${t('commands:avatar:embedavatarglobal.author', { membro: `${realMember.username}#${realMember.discriminator}` })}`, iconURL: avatarURl, url: avatarURl })
        .setDescription(`${t('commands:avatar:embedavatarglobal.desc', { avatar: avatarURl })}`)
        .setImage(avatarURl)
      return interaction.reply({ embeds: [embedavatar] })
    } else if (!idmember && membro) {
      let avatarGuild
      let row
      let error = false

      let realAvatar = guild.members.cache.get(membro.id)

      if (!realAvatar.avatarURL({ dynamic: true, size: 2048 })) {
        avatarGuild = null
      } else {
        avatarGuild = realAvatar.avatarURL({ dynamic: true, size: 2048 })
      }

      let msg
      let bnt1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('1')
        .setLabel(`${t('commands:avatar:button.label1')}`)
      let bnt2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('2')
        .setLabel(`${t('commands:avatar:button.label2')}`)

      if (avatarGuild == null) {
        bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
        row = new ActionRowBuilder().addComponents(bnt1, bnt2)
      } else {
        row = new ActionRowBuilder().addComponents(bnt1, bnt2)
      }

      let embedescolhe = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:avatar:descmessage', { emoji: emojis.emojicerto })}`
      )
      interaction.reply({ embeds: [embedescolhe], components: [row] })

      await interaction.channel
        .awaitMessageComponent({
          filter: (i) =>
            (i.customId === '1' && i.user.id === interaction.member.id) ||
            (i.customId === '2' && i.user.id === interaction.member.id),
          max: 1,
          time: 60000,
          errors: ['time'],
        })
        .then((i) => {
          msg = i.customId
          i.deferUpdate()
        })
        .catch((err) => {
          error = true
          let embedtempo = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:avatar:errortime.title', { emoji: emojis.emojierror })}`)
            .setDescription(
              `${t('commands:avatar:errortime.desc', { emoji: emojis.emojitempo, membro: interaction.member })}`
            )
          interaction.editReply({ embeds: [embedtempo], components: [] })
          return
        })

      if (msg == '1') {
        const embedav = new EmbedSay(interaction.member.user, t)
          .setAuthor(
            { name: `${t('commands:avatar:embedavatarglobal.author', {
              membro: `${membro.username}#${membro.discriminator}`,
            })}`,  url: membro.displayAvatarURL({ dynamic: true }) ,iconURL: membro.displayAvatarURL({ dynamic: true }) }
          )
          .setDescription(
            `${t('commands:avatar:embedavatarglobal.desc', {
              avatar: membro.displayAvatarURL({ dynamic: true, size: 2048 }),
            })}`
          )
          .setImage(membro.displayAvatarURL({ dynamic: true, size: 2048 }))
        interaction.editReply({ embeds: [embedav], components: [] })
        return
      } else {
        const embedav = new EmbedSay(interaction.member.user, t)
          .setAuthor({ name: `${t('commands:avatar:embedavatarglobal.author', {
            membro: `${membro.username}#${membro.discriminator}`,
          })}`, iconURL: avatarGuild, url: avatarGuild }
          )
          .setDescription(`${t('commands:avatar:embedavatarglobal.desc', { avatar: avatarGuild })}`)
          .setImage(avatarGuild)
        interaction.editReply({ embeds: [embedav], components: [] })
      }
    } else {
      let avatarGuild
      let row
      let error = false

      let realAvatar = guild.members.cache.get(member.id)

      if (!realAvatar.avatarURL({ dynamic: true, size: 2048 })) {
        avatarGuild = null
      } else {
        avatarGuild = realAvatar.avatarURL({ dynamic: true, size: 2048 })
      }

      let msg
      let bnt1 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('1')
        .setLabel(`${t('commands:avatar:button.label1')}`)
      let bnt2 = new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('2')
        .setLabel(`${t('commands:avatar:button.label2')}`)

      if (avatarGuild == null) {
        bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
        row = new ActionRowBuilder().addComponents(bnt1, bnt2)
      } else {
        row = new ActionRowBuilder().addComponents(bnt1, bnt2)
      }

      let embedescolhe = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:avatar:descmessage', { emoji: emojis.emojicerto })}`
      )
      interaction.reply({ embeds: [embedescolhe], components: [row] })

      await interaction.channel
        .awaitMessageComponent({
          filter: (i) =>
            (i.customId === '1' && i.user.id === interaction.member.id) ||
            (i.customId === '2' && i.user.id === interaction.member.id),
          max: 1,
          time: 60000,
          errors: ['time'],
        })
        .then((i) => {
          msg = i.customId
          i.deferUpdate()
        })
        .catch((err) => {
          error = true
          let embedtempo = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:avatar:errortime.title', { emoji: emojis.emojierror })}`)
            .setDescription(
              `${t('commands:avatar:errortime.desc', { emoji: emojis.emojitempo, membro: interaction.member })}`
            )
          interaction.editReply({ embeds: [embedtempo], components: [] })
          return
        })

      if (msg == '1') {
        const embedav = new EmbedSay(interaction.member.user, t)
          .setAuthor({ name: `${t('commands:avatar:embedavatarglobal.author', {
            membro: `${member.user.username}#${member.user.discriminator}`,
          })}`, iconURL: member.displayAvatarURL({ dynamic: true }), url: member.displayAvatarURL({ dynamic: true }) }
          )
          .setDescription(
            `${t('commands:avatar:embedavatarglobal.desc', {
              avatar: member.displayAvatarURL({ dynamic: true, size: 2048 }),
            })}`
          )
          .setImage(member.displayAvatarURL({ dynamic: true, size: 2048 }))
        interaction.editReply({ embeds: [embedav], components: [] })
        return
      } else {
        const embedav = new EmbedSay(interaction.member.user, t)
          .setAuthor({ name: `${t('commands:avatar:embedavatarglobal.author', {
            membro: `${member.user.username}#${member.user.discriminator}`,
          })}`, iconURL: avatarGuild, url: avatarGuild }
          )
          .setDescription(`${t('commands:avatar:embedavatarglobal.desc', { avatar: avatarGuild })}`)
          .setImage(avatarGuild)
        interaction.editReply({ embeds: [embedav], components: [] })
      }
    }
  },
}
