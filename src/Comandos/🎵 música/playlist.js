const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'playlist',
  description: 'Faz eu tocar alguma playlist sua atráves do link da mesma',
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
