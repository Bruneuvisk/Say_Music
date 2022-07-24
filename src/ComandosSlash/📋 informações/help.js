const { PermissionsBitField, SelectMenuBuilder, ActionRowBuilder, ApplicationCommandType, ApplicationCommandOptionType,  } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')

module.exports = {
  name: 'help',
  description: '[📋] Exibe minha lista dos meus comandos em que possuo',
  cooldown: 10,
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
      name: "comando",
      description: "Qual comando deseja exibir informação?",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    const { commands } = client
    const data = []

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

    const args = options.getString('comando')
    if (!args) {
      let menuzindecria = new SelectMenuBuilder()
        .setCustomId('ajudaSelector')
        .setPlaceholder(`${t('commands:help:menuzin.selector')}`)
        .addOptions([
          {
            label: `${t('commands:help:menuzin.configtitle', {
              config: commands.filter((command) => command.category == '⚙️ configurações').size,
            })}`,
            description: `${t('commands:help:menuzin.configdesc')}`,
            value: '1',
          },
          {
            label: `${t('commands:help:menuzin.infotitle', {
              info: commands.filter((command) => command.category == '📋 informações').size,
            })}`,
            description: `${t('commands:help:menuzin.infodesc')}`,
            value: '2',
          },
          {
            label: `${t('commands:help:menuzin.musictitle', {
              music: commands.filter((command) => command.category == '🎵 música').size,
            })}`,
            description: `${t('commands:help:menuzin.musicdesc')}`,
            emoji: '🎵',
            value: '3',
          },
          {
            label: `${t('commands:help:menuzin.filtertitle', {
              filter: commands.filter((command) => command.category == '👀 filtros').size,
            })}`,
            description: `${t('commands:help:menuzin.filterdesc')}`,
            emoji: '👀',
            value: '4',
          },
          {
            label: `${t('commands:help:menuzin.queuetitle', {
              queue: commands.filter((command) => command.category == '⚜️ fila').size,
            })}`,
            description: `${t('commands:help:menuzin.queuedesc')}`,
            emoji: '⚜️',
            value: '5',
          },
          {
            label: `${t('commands:help:menuzin.voltetitle')}`,
            description: `${t('commands:help:menuzin.voltedesc')}`,
            value: '7',
          },
        ])

      let row = new ActionRowBuilder().addComponents(menuzindecria)

      const embed1 = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
        .setDescription(
          `${t('commands:help:embedinicio.description', { emoji: emojis.emojicerto, membro: interaction.member })}`
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      interaction.reply({ embeds: [embed1], components: [row] })

      const collector = interaction.channel.createMessageComponentCollector({
        filter: (i) => i.user.id === interaction.member.id && i.customId === 'ajudaSelector',
        time: 180000,
      })

      collector.on('collect', async (i) => {
        i.deferUpdate()

        if (i.values.includes('1')) {
          let embededitcria = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
            .setDescription(
              `${t('commands:help:embedinicio.desconfig', {
                emoji: emojis.emojicerto,
                emojicert: emojis.emojicerto,
                comandos: client.commands.size,
                lista: emojis.emojilista,
                comandosconfig: commands
                  .filter((command) => command.category == '⚙️ configurações')
                  .map((command) => command.name)
                  .join('`, `'),
                emojiss: emojis.emojicerto,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          interaction.editReply({ embeds: [embededitcria], components: [row] })
        } else if (i.values.includes('2')) {
          let editzincria = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
            .setDescription(
              `${t('commands:help:embedinicio.descinfo', {
                emoji: emojis.emojicerto,
                emojicert: emojis.emojicerto,
                comandos: client.commands.size,
                lista: emojis.emojilista,
                comandosinfo: commands
                  .filter((command) => command.category == '📋 informações')
                  .map((command) => command.name)
                  .join('`, `'),
                emojiss: emojis.emojicerto,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          interaction.editReply({ embeds: [editzincria], components: [row] })
        } else if (i.values.includes('3')) {
          let editzincria = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
            .setDescription(
              `${t('commands:help:embedinicio.descmusic', {
                emoji: emojis.emojicerto,
                emojicert: emojis.emojicerto,
                comandos: client.commands.size,
                lista: emojis.emojilista,
                comandosmusic: commands
                  .filter((command) => command.category == '🎵 música')
                  .map((command) => command.name)
                  .join('`, `'),
                emojiss: emojis.emojicerto,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          interaction.editReply({ embeds: [editzincria], components: [row] })
        } else if (i.values.includes('4')) {
          let editzincria = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
            .setDescription(
              `${t('commands:help:embedinicio.descfilter', {
                emoji: emojis.emojicerto,
                emojicert: emojis.emojicerto,
                comandos: client.commands.size,
                lista: emojis.emojilista,
                comandosfiltro: commands
                  .filter((command) => command.category == '👀 filtros')
                  .map((command) => command.name)
                  .join('`, `'),
                emojiss: emojis.emojicerto,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          interaction.editReply({ embeds: [editzincria], components: [row] })
        } else if (i.values.includes('5')) {
          let editzincria = new EmbedSay(interaction.member.user, t)
            .setTitle(`${t('commands:help:embedinicio.title', { emoji: emojis.emojisay })}`)
            .setDescription(
              `${t('commands:help:embedinicio.descqueue', {
                emoji: emojis.emojicerto,
                emojicert: emojis.emojicerto,
                comandos: client.commands.size,
                lista: emojis.emojilista,
                comandosqueue: commands
                  .filter((command) => command.category == '⚜️ fila')
                  .map((command) => command.name)
                  .join('`, `'),
                emojiss: emojis.emojicerto,
              })}`
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          interaction.editReply({ embeds: [editzincria], components: [row] })
        } else if (i.values.includes('7')) {
          interaction.editReply({ embeds: [embed1], components: [row] })
        }
      })
      return
    }

    const name = args
    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name))
    let use

    if (!command) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:help:namecommand.error', { emoji: emojis.emojierror })}`,
      })
    }

    data.push(`${t('commands:help:namecommand.name', { emoji: emojis.emojicerto, command: command.name })}`)
    if (command.description)
      data.push(
        `${t('commands:help:namecommand.desc', {
          emoji: emojis.emojisetinha,
          command: t(`commands:help:command:${args}.description`),
        })}`
      )
    if (command.usage)
      data.push(
        `${t('commands:help:namecommand.use', {
          emoji: emojis.emojisetinha,
          command: `/${command.name} ${command.usage}`,
        })}`
      )
    data.push(
      `${t('commands:help:namecommand.cooldown', { emoji: emojis.emojisetinha, command: command.cooldown || 3 })}`
    )

    const embedzin = new EmbedSay(interaction.member.user, t)
      .setTitle(`${t('commands:help:namecommand.title', { emoji: emojis.emojisay, command: command.name })}`)
      .setDescription(data.join('\n'))
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
    interaction.reply({ content: `${interaction.member}`, embeds: [embedzin] })
  },
}
