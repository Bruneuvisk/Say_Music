const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const moment = require('moment')
moment.locale('pt-BR')
require('moment-duration-format')

module.exports = {
  name: 'lavalink',
  description: 'Mostra as informações sobre meu lavalink conectado',
  cooldown: 10,
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
