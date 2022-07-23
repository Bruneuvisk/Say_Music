const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'playlist',
  description: 'Faz eu tocar alguma playlist sua atráves do link da mesma',
  aliases: [],
  category: '🎵 música',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 15,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
