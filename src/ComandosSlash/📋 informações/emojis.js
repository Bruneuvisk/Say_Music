const { PermissionsBitField, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const Collection = require('../../Struturas/Collection')

module.exports = {
  name: 'emojis',
  description: '[📋] Lista todos os emojis do seu servidor exibindo o nome e o emoji',
  cooldown: 10,
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

    let row = new ActionRowBuilder()

    let nextButton = new ButtonBuilder()
      .setLabel(`${t('commands:emojis:button.label1')}`)
      .setCustomId('next')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('➡️')
      .setDisabled(false)

    let backButton = new ButtonBuilder()
      .setLabel(`${t('commands:emojis:button.label2')}`)
      .setCustomId('back')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⬅️')
      .setDisabled(true)

    if (pages <= 1) nextButton = ButtonBuilder.from(nextButton).setDisabled(true)

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

        nextButton = ButtonBuilder.from(nextButton).setDisabled(true)
        backButton = ButtonBuilder.from(backButton).setDisabled(true)

        row.addComponents(backButton, nextButton)

        await interaction.editReply({
          embeds: [embedEmoji.setAuthor({ name: `${t('commands:emojis:time')}` })],
          components: [row],
        })
      })
      .on('collect', async (r) => {
        switch (r.customId) {
          case 'next':
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) if (actualPage === pages) return

            actualPage++
            paginatedItens = emojisArray.paginate(actualPage, 30)
            embedEmoji.setDescription(paginatedItens.join('\n'))

            if (actualPage === pages && interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages))
            nextButton = ButtonBuilder.from(nextButton).setDisabled(true)

            if (actualPage === pages && !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
              nextButton = ButtonBuilder.from(nextButton).setDisabled(true)
              backButton = ButtonBuilder.from(backButton).setDisabled(true)
            }

            backButton = ButtonBuilder.from(backButton).setDisabled(false)

            row = new ActionRowBuilder().addComponents(backButton, nextButton)

            await r.deferUpdate()
            await interaction.editReply({ embeds: [embedEmoji], components: [row] })

            break

          case 'back': {
            if (interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) if (actualPage === 1) return

            actualPage--
            paginatedItens = emojisArray.paginate(actualPage, 30)
            embedEmoji.setDescription(paginatedItens.join('\n'))

            if (actualPage === 1 && interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages))
              backButton = ButtonBuilder.from(backButton).setDisabled(true)

            if (actualPage === 1 && !interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.SendMessages)) {
              nextButton = ButtonBuilder.from(nextButton).setDisabled(true)
              backButton = ButtonBuilder.from(backButton).setDisabled(true)
            }

            nextButton = ButtonBuilder.from(nextButton).setDisabled(false)

            row = new ActionRowBuilder().addComponents(backButton, nextButton)

            await r.deferUpdate()
            await interaction.editReply({ embeds: [embedEmoji], components: [row] })
          }
        }
      })
  },
}
