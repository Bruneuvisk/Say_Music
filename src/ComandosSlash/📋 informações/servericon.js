const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'servericon',
  description: 'Mostra o icone do servidor',
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
    //{ String: { name: 'id_membro', description: 'Qual membro deseja pegar as informações pelo id?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{ User: { name: 'membro', description: 'Qual membro deseja pegar as informações?', required: false } }, //to use in the code: interacton.getUser("ping_a_user")
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
    },*/
    //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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

    if (!guild.iconURL({ dynamic: true, size: 2048 })) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:servericon:error', { emoji: emojis.emojierror })}`,
      })
    }

    let bnt1 = new MessageButton()
      .setStyle('LINK')
      .setLabel(`Download`)
      .setEmoji('🖼️')
      .setURL(`${guild.iconURL({ dynamic: true, size: 2048 })}`)

    let row = new MessageActionRow().addComponents(bnt1)

    const guildIcon = guild.iconURL({ dynamic: true, size: 2048 })

    const embedIcon = new EmbedSay(interaction.member.user, t)
      .setAuthor(`${t('commands:servericon:embedicon', { guild: guild.name })}`, guildIcon, guildIcon)
      .setImage(guildIcon)
    interaction.reply({ embeds: [embedIcon], components: [row] })
  },
}
