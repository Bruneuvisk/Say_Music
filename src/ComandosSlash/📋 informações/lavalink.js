const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const moment = require('moment')
moment.locale('pt-BR')
require('moment-duration-format')

module.exports = {
  name: 'lavalink',
  description: 'Mostra as informações sobre meu lavalink conectado',
  cooldown: 10,
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
    //{ String: { name: 'comando', description: 'Qual comando deseja exibir informação?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    let CheckNode = client.manager.nodes.get(config.nodesPlayer.erelaid)

    if (!CheckNode || !CheckNode.connected) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:lavalink:errorconect', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    const embedInfo = new EmbedSay(interaction.member.user, t).setTitle(
      `${t('commands:lavalink:embed.title', { emoji: emojis.emojisay })}`
    )

    client.manager.nodes.map((node) => {
      const uptime = moment
        .duration(node.stats.uptime)
        .format(`${t('commands:lavalink:formatdate')}`)
        .replace('Minsutos', 'Minutos')
      embedInfo.setDescription(
        `${t('commands:lavalink:embed.desc', {
          emoji: emojis.emojicerto,
          emojis: emojis.emojisetinha,
          players: node.stats.players,
          emojise: emojis.emojisetinha,
          uptime: uptime,
          emojiset: emojis.emojisetinha,
          ram: Math.floor(node.stats.memory.used / 1000 / 1000),
          emojiseta: emojis.emojisetinha,
          cpu: node.stats.cpu.systemLoad.toFixed(1),
        })}`
      )
    })

    interaction.reply({ embeds: [embedInfo] })
  },
}
