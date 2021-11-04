const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'avatar',
  description: 'Exibe o avatar de um membro',
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
    { String: { name: 'id_membro', description: 'Qual membro deseja pegar o avatar pelo id?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    { User: { name: 'membro', description: 'Qual membro deseja pegar o avatar?', required: false } }, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
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
    },*/ //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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
        .setAuthor(
          `${t('commands:avatar:embedavatarglobal.author', {
            membro: `${realMember.username}#${realMember.discriminator}`,
          })}`,
          avatarURl,
          avatarURl
        )
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
      let bnt1 = new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId('1')
        .setLabel(`${t('commands:avatar:button.label1')}`)
      let bnt2 = new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId('2')
        .setLabel(`${t('commands:avatar:button.label2')}`)

      if (avatarGuild == null) {
        bnt2.setDisabled(true)
        row = new MessageActionRow().addComponents(bnt1, bnt2)
      } else {
        row = new MessageActionRow().addComponents(bnt1, bnt2)
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
            `${t('commands:avatar:embedavatarglobal.author', {
              membro: `${membro.username}#${membro.discriminator}`,
            })}`,
            membro.displayAvatarURL({ dynamic: true }),
            membro.displayAvatarURL({ dynamic: true })
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
          .setAuthor(
            `${t('commands:avatar:embedavatarglobal.author', {
              membro: `${membro.username}#${membro.discriminator}`,
            })}`,
            avatarGuild,
            avatarGuild
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
      let bnt1 = new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId('1')
        .setLabel(`${t('commands:avatar:button.label1')}`)
      let bnt2 = new MessageButton()
        .setStyle('SECONDARY')
        .setCustomId('2')
        .setLabel(`${t('commands:avatar:button.label2')}`)

      if (avatarGuild == null) {
        bnt2.setDisabled(true)
        row = new MessageActionRow().addComponents(bnt1, bnt2)
      } else {
        row = new MessageActionRow().addComponents(bnt1, bnt2)
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
            `${t('commands:avatar:embedavatarglobal.author', {
              membro: `${member.user.username}#${member.user.discriminator}`,
            })}`,
            member.displayAvatarURL({ dynamic: true }),
            member.displayAvatarURL({ dynamic: true })
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
          .setAuthor(
            `${t('commands:avatar:embedavatarglobal.author', {
              membro: `${member.user.username}#${member.user.discriminator}`,
            })}`,
            avatarGuild,
            avatarGuild
          )
          .setDescription(`${t('commands:avatar:embedavatarglobal.desc', { avatar: avatarGuild })}`)
          .setImage(avatarGuild)
        interaction.editReply({ embeds: [embedav], components: [] })
      }
    }
  },
}
