const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'invite',
  description: 'Me convide para o seu servidor',
  cooldown: 5,
  memberperm: ['SendMessages', 'UseApplicationCommands'],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    var permissions = "2482367856"
    let invite = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:invite:embed.title', { emoji: emojis.emojilink })}`)
      .setDescription(
        `${t('commands:invite:embed.desc', { emoji: emojis.emojicerto, clientid: client.user.id, perms: permissions })}`
      )
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=1000458337453867038&permissions=2482367856&scope=bot%20applications.commands`
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    return interaction.reply({ embeds: [invite] })
  },
}
