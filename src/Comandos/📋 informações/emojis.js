const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'emojis',
  description: 'Lista todos os emojis do seu servidor exibindo o nome e o emoji',
  aliases: [],
  category: '📋 informações',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 10,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
