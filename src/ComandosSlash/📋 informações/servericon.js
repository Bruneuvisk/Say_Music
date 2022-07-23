const { PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'servericon',
  description: 'Mostra o icone do servidor',
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
    const {
      member,
      channelId,
      guildId,
      applicationId,
      commandName,
      deferred,
      replied,
      ephemeral,
      options,
      id,
      createdTimestamp,
    } = interaction
    const { guild } = member

    if (!guild.iconURL({ dynamic: true, size: 2048 })) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:servericon:error', { emoji: emojis.emojierror })}`,
      })
    }

    let bnt1 = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(`Download`)
      .setEmoji('🖼️')
      .setURL(`${guild.iconURL({ dynamic: true, size: 2048 })}`)

    let row = new ActionRowBuilder().addComponents(bnt1)

    const guildIcon = guild.iconURL({ dynamic: true, size: 2048 })

    const embedIcon = new EmbedSay(interaction.member.user, t)
      .setAuthor(`${t('commands:servericon:embedicon', { guild: guild.name })}`, guildIcon, guildIcon)
      .setImage(guildIcon)
    interaction.reply({ embeds: [embedIcon], components: [row] })
  },
}
