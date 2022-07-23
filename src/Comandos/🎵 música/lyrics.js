const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'lyrics',
  description: 'Exibe a letra da música que queira ou a que está sendo tocada',
  aliases: [],
  category: '🎵 música',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 10,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
