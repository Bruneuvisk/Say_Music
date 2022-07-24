const config = require('../Interfaces/config.json')
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')

module.exports.getPrefix = getPrefix
module.exports.paginateItens = paginateItens
module.exports.arrayMove = arrayMove
module.exports.createBar = createBar
module.exports.shuffle = shuffle
module.exports.format = format

async function getPrefix(id, client) {
  const server = await client.database.servidores.findOne({
    idServer: id,
  })
  let prefix

  if (!server) {
    prefix = config.prefix
  } else {
    prefix = server.prefix
  }

  return prefix
}

async function paginateItens(interaction, pages, client, timeout = 120000) {
  let bnt1 = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('1').setEmoji(`⬅️`).setLabel('Voltar')
  let bnt2 = new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('2').setEmoji(`➡️`).setLabel('Avançar')

  if (!interaction && !interaction.channel) throw new Error('O canal não existe bruno meu deus.')
  if (!pages) throw new Error('As Paginas não existem.')

  if (pages.length <= 1) ButtonBuilder.from(bnt2).setDisabled(true)

  let row = new ActionRowBuilder().addComponents(bnt1, bnt2)

  let page = 0
  await interaction.reply({
    embeds: [
      pages[page].setFooter({ text: `Page: ${page + 1}/${pages.length}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) }),
    ],
    components: [row],
  })
  const buttonCollector = interaction.channel.createMessageComponentCollector({
    filter: (i) =>
      (i.user.id === interaction.member.id && i.customId === '1') ||
      (i.user.id === interaction.member.id && i.customId === '2'),
    time: timeout,
  })
  buttonCollector.on('collect', async (b) => {
    b.deferUpdate()
    switch (b.customId) {
      case '1':
        if (page === 1) bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)

        if (page === 1) {
          bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
          bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)
        }

        bnt2 = ButtonBuilder.from(bnt2).setDisabled(false)

        row = new ActionRowBuilder().addComponents(bnt1, bnt2)

        page = page > 0 ? --page : pages.length - 1

        interaction.editReply({
          embeds: [
            pages[page].setFooter(
              { text: `Page: ${page + 1}/${pages.length}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) }
            ),
          ],
          components: [row],
        })
        break
      case '2':
        if (page === pages.length) bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)


        if (page === pages.length) {
          bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
          bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)
        }

        bnt1 = ButtonBuilder.from(bnt1).setDisabled(false)

        row = new ActionRowBuilder().addComponents(bnt1, bnt2)

        page = page + 1 < pages.length ? ++page : 0

        interaction.editReply({
          embeds: [
            pages[page].setFooter(
              { text: `Page: ${page + 1}/${pages.length}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) }
            ),
          ],
          components: [row],
        })
        break
    }
  })
  buttonCollector.on('end', () => {
    bnt2 = ButtonBuilder.from(bnt2).setDisabled(true)
    bnt1 = ButtonBuilder.from(bnt1).setDisabled(true)

    row = new ActionRowBuilder().addComponents(bnt1, bnt2)

    interaction.editReply({
      embeds: [
        pages[page].setFooter(
          { text: `Page: ${page + 1}/${pages.length}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) }
        ),
      ],
      components: [row],
    })
  })
}

function arrayMove(array, from, to) {
  array = [...array]
  const startIndex = from < 0 ? array.length + from : from
  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = to < 0 ? array.length + to : to
    const [item] = array.splice(from, 1)
    array.splice(endIndex, 0, item)
  }
  return array
}

function createBar(player) {
  if (!player.queue.current) return `**[💜${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`
  let current = player.queue.current.duration !== 0 ? player.position : player.queue.current.duration
  let total = player.queue.current.duration
  let size = 25
  let line = '▬'
  let slider = '💜'
  let bar =
    current > total
      ? [line.repeat((size / 2) * 2), (current / total) * 100]
      : [
          line.repeat(Math.round((size / 2) * (current / total))).replace(/.$/, slider) +
            line.repeat(size - Math.round(size * (current / total)) + 1),
          current / total,
        ]
  if (!String(bar[0]).includes('💜')) return `**[💜${line.repeat(size - 1)}]**\n**00:00:00 / 00:00:00**`
  return `**[${bar[0]}]**\n**${
    new Date(player.position).toISOString().substr(11, 8) +
    ' / ' +
    (player.queue.current.duration == 0
      ? ' ◉ MUSIC'
      : new Date(player.queue.current.duration).toISOString().substr(11, 8))
  }**`
}

function shuffle(a) {
  var j, x, i
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1))
    x = a[i]
    a[i] = a[j]
    a[j] = x
  }
  return a
}

function format(millis) {
  var h = Math.floor(millis / 3600000),
    m = Math.floor(millis / 60000),
    s = ((millis % 60000) / 1000).toFixed(0)
  if (h < 1)
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ' | ' + Math.floor(millis / 1000) + ' Seconds'
  else
    return (
      (h < 10 ? '0' : '') +
      h +
      ':' +
      (m < 10 ? '0' : '') +
      m +
      ':' +
      (s < 10 ? '0' : '') +
      s +
      ' | ' +
      Math.floor(millis / 1000) +
      ' Seconds'
    )
}
