const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'lavalink',
  description: 'Mostra as informações sobre meu lavalink conectado',
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
