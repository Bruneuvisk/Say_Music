const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'queuestatus',
  description: 'Mostra os status da sua atual fila de músicas',
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
