const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'leave',
  description: 'Faz eu sair do canal de voz me desconectando',
  aliases: [],
  category: '🎵 música',
  MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
  ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
  usage: '',
  cooldown: 5,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
