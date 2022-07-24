const { PermissionsBitField, SelectMenuBuilder, MessageActionRow, ApplicationCommandOptionType } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'language',
  description: '[⚙️] Configura uma linguagem para seu servidor.',
  cooldown: 10,
  memberperm: [
    'SendMessages',
    'UseApplicationCommands',
    'Administrator',
  ],
  clientperm: [
    'EmbedLinks',
    'SendMessages',
    'UseApplicationCommands',
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    {
      name: "idioma",
      description: "Qual idioma deseja definir neste servidor?",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'pt-BR', value: 'pt-BR' },
        { name: 'es-ES', value: 'es-ES' },
        { name: 'en-US', value: 'en-US' }
      ],
    },
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    const server = await client.database.servidores.findOne({
      idServer: interaction.guild.id,
    })

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

    const args = options.getString('idioma')
    const lang = server.language
    let atualang

    if (lang == 'pt-BR') {
      atualang = `🇧🇷 pt-BR`
    } else if (lang == 'en-US') {
      atualang = `🇺🇸 en-US`
    } else if (lang == 'es-ES') {
      atualang = `🇪🇸 es-ES`
    }

    if (!args) {
      let embedregister = new EmbedSay(interaction.member.user, t).setDescription(
        `${t('commands:language:embed.desc', {
          emoji: emojis.emojicerto,
          lang: atualang,
          emojiseta: emojis.emojisetinha,
        })}`
      )
      return interaction.reply({ ephemeral: true, embeds: [embedregister] })
    } else if (args) {
      if (args == lang) {
        return interaction.reply({
          ephemeral: true,
          content: `${t('commands:language:errorlang', { emoji: emojis.emojierror })}`,
        })
      }

      await client.database.servidores.findOneAndUpdate(
        { idServer: interaction.guild.id },
        { $set: { language: args } }
      )

      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:language:setlang', { emoji: emojis.emojicerto, lang: args })}`,
      })
    }
  },
}
