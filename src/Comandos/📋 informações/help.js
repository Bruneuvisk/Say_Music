const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Exibe minha lista dos meus comandos em que possuo',
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
