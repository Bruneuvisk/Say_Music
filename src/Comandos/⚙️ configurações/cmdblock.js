const { PermissionsBitField, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'cmdblock',
  description:
    'Consegue definir se você quer bloquear comandos ou definir canais para realizar os meus comandos, também conseguirá ver selecionando lista consegue ver os comandos ou os canais, caso queira remover um comando ou canal basta enviar um canal ou comando que já tem na minha lista que eu mesmo apago',
  aliases: [],
  category: '⚙️ configurações',
  MemberPerm: [PermissionsBitField.Flags.SendMessages],
  ClientPerm: [PermissionsBitField.Flags.EmbedLinks, PermissionsBitField.Flags.SendMessages],
  usage: '',
  cooldown: 10,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
