const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'lavalink',
  description: 'Mostra as informações sobre meu lavalink conectado',
  aliases: [],
  category: '📋 informações',
  MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
  ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
  usage: '',
  cooldown: 10,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
