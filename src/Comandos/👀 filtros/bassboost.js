const { PermissionsBitField, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'bassboost',
  description: 'Ativa o efeito bassboost na música que esteja tocando',
  aliases: [],
  category: '👀 filtros',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 5,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
