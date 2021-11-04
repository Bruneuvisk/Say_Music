const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'language',
  description: 'Configura uma linguagem para seu servidor.',
  cooldown: 10,
  memberperm: [
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
    Permissions.FLAGS.ADMINISTRATOR,
  ],
  clientperm: [
    Permissions.FLAGS.EMBED_LINKS,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{ String: { name: 'comando', description: 'Qual comando deseja bloquear no servidor?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{ Channel: { name: 'canal', description: 'Qual canal deseja definir para comandos no bot?', required: false } }, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    {
      StringChoices: {
        name: 'lingua',
        description: 'Qual linguagem deseja definir neste servidor?',
        required: false,
        choices: [
          ['pt-BR', 'pt-BR'],
          ['es-ES', 'es-ES'],
          ['en-US', 'en-US'],
        ],
      },
    }, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
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

    const args = options.getString('lingua')
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
