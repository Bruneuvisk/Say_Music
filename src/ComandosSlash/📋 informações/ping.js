const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'ping',
  description: '[📋] Demonstra a Latência e a API sobre mim',
  cooldown: 5,
  memberperm: ['SendMessages', 'UseApplicationCommands'],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      name: "qual_ping",
      description: "Qual ping você quer saber sobre mim?",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'bot', value: 'botping' },
        { name: 'discord_api', value: 'Discord Api' }
      ],
    },
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    try {
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

      const StringOption = options.getString('qual_ping')

      if (StringOption == 'botping') {
        const embed = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:botping.waitmessage', { emoji: emojis.emojicarregando })}`
        )

        const embedtrue = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:botping.message', {
            emoji: emojis.emojicerto,
            ping: Math.floor(Date.now() - createdTimestamp - 2 * Math.floor(client.ws.ping)),
          })}`
        )

        await interaction.reply({ content: `${t('commands:ping:botping.carregando')}`, embeds: [embed] })
        setTimeout(() => {
          interaction.editReply({ content: `${t('commands:ping:botping.result')}`, embeds: [embedtrue] })
        }, 5000)
      } else {
        const embedtrue = new EmbedSay(interaction.member.user, t).setDescription(
          `${t('commands:ping:apiping.message', { emoji: emojis.emojicerto, ping: Math.floor(client.ws.ping) })}`
        )

        interaction.reply({ content: `${t('commands:ping:apiping.result')}`, embeds: [embedtrue] })
      }
    } catch (e) {
      console.log(`Ocorreu um erro com o comando de ping ${e.stack}`)
    }
  },
}
