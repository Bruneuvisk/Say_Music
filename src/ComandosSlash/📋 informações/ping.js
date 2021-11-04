const { MessageEmbed, Permissions } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'ping',
  description: 'Demonstra a Latência e a API sobre mim',
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
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      StringChoices: {
        name: 'qual_ping',
        description: 'Qual ping você quer saber sobre mim?',
        required: true,
        choices: [
          ['bot', 'botping'],
          ['Discord Api', 'discord_api'],
        ],
      },
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    try {
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

      const StringOption = options.getString('qual_ping')

      if (StringOption == 'botping') {
        const embed = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:botping.waitmessage', { emoji: emojis.emojicarregando })}`
        )

        const embedtrue = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:botping.message', {
            emoji: emojis.emojicerto,
            ping: Math.floor(Date.now() - createdTimestamp - 2 * Math.floor(client.ws.ping)),
          })}`
        )

        await interaction.reply({ content: `${t('commands:ping:botping.carregando')}`, embeds: [embed] })
        setTimeout(() => {
          interaction.editReply({ content: `${t('commands:ping:botping.result')}`, embeds: [embedtrue] })
        }, 5000)
      } else {
        const embedtrue = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:apiping.message', { emoji: emojis.emojicerto, ping: Math.floor(client.ws.ping) })}`
        )

        interaction.reply({ content: `${t('commands:ping:apiping.result')}`, embeds: [embedtrue] })
      }
    } catch (e) {
      console.log(`Ocorreu um erro com o comando de ping ${e.stack}`)
    }
  },
}
