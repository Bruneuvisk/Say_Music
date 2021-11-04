const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'botinfo',
  description: 'Exibe as informações minhas em geral no discord',
  aliases: [],
  category: '📋 informações',
  MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
  ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
  usage: '',
  cooldown: 5,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
