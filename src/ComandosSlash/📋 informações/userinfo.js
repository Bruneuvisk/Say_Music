const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'userinfo',
  description: 'Exibe as informações de um usuário',
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
    { String: { name: 'id_membro', description: 'Qual membro deseja pegar as informações pelo id?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    { User: { name: 'membro', description: 'Qual membro deseja pegar as informações?', required: false } }, //to use in the code: interacton.getUser("ping_a_user")
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
