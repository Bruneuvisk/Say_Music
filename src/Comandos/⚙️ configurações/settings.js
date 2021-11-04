const { MessageButton, MessageActionRow, MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  name: 'settings',
  description:
    'Configura as configurações de dj para o seu servidor, pode configurar cargos para dj e selecionar quais comandos quer atribuir para os djs para remover o comando ou cargo só enviar um cargo ou comando que já esteja na lista',
  aliases: [],
  category: '⚙️ configurações',
  MemberPerm: [Permissions.FLAGS.SEND_MESSAGES],
  ClientPerm: [Permissions.FLAGS.EMBED_LINKS, Permissions.FLAGS.SEND_MESSAGES],
  usage: '',
  cooldown: 10,
  async run({ client, message, args, prefix, color, language }, t) {
    console.log('LOCK')
  },
}
