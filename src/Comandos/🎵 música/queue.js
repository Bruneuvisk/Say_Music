const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'queue',
  description: 'Lista a fila de músicas atual no servidor',
  aliases: [],
  category: '🎵 música',
  MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
  ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
  usage: '',
  cooldown: 15,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
