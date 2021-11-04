const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const Collection = require('../../Struturas/Collection')

module.exports = {
  name: 'emojis',
  description: 'Lista todos os emojis do seu servidor exibindo o nome e o emoji',
  cooldown: 10,
  memberperm: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_APPLICATION_COMMANDS],
  clientperm: [
    Permissions.FLAGS.EMBED_LINKS,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{ String: { name: 'comando', description: 'Qual comando deseja exibir informação?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
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

    const embedEmoji = new EmbedSay(interaction.member.user, t).setTitle(
      `${t('commands:emojis:embed.title', { emoji: emojis.emojisay, guild: interaction.guild.name })}`
    )

    const emojisArray = new Collection()

    let actualPage = 1

    interaction.guild.emojis.cache.map((x) => {
      emojisArray.push(
        `${x} **-** \`${x.id ? (x.animated ? `<a:${x.name}:${x.id}>` : `<:${x.name}:${x.id}>`) : x.name}\``
      )
    })

    const pages = Math.ceil(emojisArray.length() / 30)

    let paginatedItens = emojisArray.paginate(actualPage, 30)

    embedEmoji.setDescription(paginatedItens.join('\n'))

    let row = new MessageActionRow()

    const nextButton = new MessageButton()
      .setLabel(`${t('commands:emojis:button.label1')}`)
      .setCustomId('next')
      .setStyle('SECONDARY')
      .setEmoji('➡️')
      .setDisabled(false)

    const backButton = new MessageButton()
      .setLabel(`${t('commands:emojis:button.label2')}`)
      .setCustomId('back')
      .setStyle('SECONDARY')
      .setEmoji('⬅️')
      .setDisabled(true)

    if (pages <= 1) nextButton.setDisabled(true)

    row.addComponents(backButton, nextButton)

    await interaction.reply({ embeds: [embedEmoji], components: [row] })

    const filter = (i) => {
      return i.isButton() && i.user.id === interaction.member.id
    }

    await interaction.channel
      .createMessageComponentCollector({
        filter: filter,
        time: 60000,
      })

      .on('end', async (r, reason) => {
        if (reason != 'time') return

        nextButton.setDisabled(true)
        backButton.setDisabled(true)

        row.addComponents(backButton, nextButton)

        await interaction.editReply({
          embeds: [embedEmoji.setAuthor(`${t('commands:emojis:time')}`)],
          components: [row],
        })
      })
      .on('collect', async (r) => {
        switch (r.customId) {
          case 'next':
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) if (actualPage === pages) return

            actualPage++
            paginatedItens = emojisArray.paginate(actualPage, 30)
            embedEmoji.setDescription(paginatedItens.join('\n'))

            if (actualPage === pages && interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES))
              nextButton.setDisabled(true)

            if (actualPage === pages && !interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
              nextButton.setDisabled(true)
              backButton.setDisabled(true)
            }

            backButton.setDisabled(false)

            row = new MessageActionRow().addComponents(backButton, nextButton)

            await r.deferUpdate()
            await interaction.editReply({ embeds: [embedEmoji], components: [row] })

            break

          case 'back': {
            if (interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) if (actualPage === 1) return

            actualPage--
            paginatedItens = emojisArray.paginate(actualPage, 30)
            embedEmoji.setDescription(paginatedItens.join('\n'))

            if (actualPage === 1 && interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES))
              backButton.setDisabled(true)

            if (actualPage === 1 && !interaction.guild.me.permissions.has(Permissions.FLAGS.SEND_MESSAGES)) {
              nextButton.setDisabled(true)
              backButton.setDisabled(true)
            }

            nextButton.setDisabled(false)

            row = new MessageActionRow().addComponents(backButton, nextButton)

            await r.deferUpdate()
            await interaction.editReply({ embeds: [embedEmoji], components: [row] })
          }
        }
      })
  },
}
