const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'userinfo',
  description: 'Exibe as informações de um membro ou pelo id do próprio',
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
