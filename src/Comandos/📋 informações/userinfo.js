const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'userinfo',
  description: 'Exibe as informações de um membro ou pelo id do próprio',
  aliases: [],
  category: '📋 informações',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 5,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
