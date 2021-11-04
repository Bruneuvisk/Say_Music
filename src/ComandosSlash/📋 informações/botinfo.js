const { MessageEmbed, Permissions, MessageButton, MessageActionRow, version } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
let os = require('os')
let cpuStat = require('cpu-stat')
const moment = require('moment')
moment.locale('pt-BR')
require('moment-duration-format')

module.exports = {
  name: 'botinfo',
  description: 'Exibe as informações minhas em geral no discord',
  cooldown: 5,
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
    //{ String: { name: 'id_membro', description: 'Qual membro deseja pegar as informações pelo id?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{ User: { name: 'membro', description: 'Qual membro deseja pegar as informações?', required: false } }, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    /*{
      StringChoices: {
        name: 'qual_ping',
        description: 'Qual ping você quer saber sobre mim?',
        required: true,
        choices: [
          ['bot', 'botping'],
          ['Discord Api', 'discord_api'],
        ],
      },
    },*/
    //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
    cpuStat.usagePercent(async function (e, percent, seconds) {
      const cliente = await client.database.cliente.findOne({
        _id: client.user.id,
      })

      let quantidadecanaisconectado = 0
      let guilds = client.guilds.cache.map((guild) => guild)
      for (let i = 0; i < guilds.length; i++) {
        if (guilds[i].me.voice.channel) quantidadecanaisconectado += 1
      }
      if (quantidadecanaisconectado > client.guilds.cache.size) quantidadecanaisconectado = client.guilds.cache.size
      let bruno = await client.users.fetch('469661232153231385')
      let kyo = await client.users.fetch('495099291870953473')
      let coldz = await client.users.fetch('405173652049494026')
      let babiz = await client.users.fetch('772523669674917948')
      let luck = await client.users.fetch('744566554078871603')
      let big = await client.users.fetch('800249752754585631')
      let gzn = await client.users.fetch('514466927779905539')
      let bnturl = new MessageButton()
        .setStyle('LINK')
        .setURL('https://discord.gg/xpYSzpJ8rK')
        .setEmoji("💜")
        .setLabel(`${t('commands:botinfo:button.label1')}`)
      let bntadd = new MessageButton()
        .setStyle('LINK')
        .setEmoji("💜")
        .setURL(
          'https://discord.com/api/oauth2/authorize?client_id=870200133642485802&permissions=8589934583&scope=bot%20applications.commands'
        )
        .setLabel(`${t('commands:botinfo:button.label2')}`)

      let row = new MessageActionRow().addComponents(bnturl, bntadd)

      let embedbotinfo = new EmbedSay(interaction.member.user, t)
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle(`${t('commands:botinfo:embed.title', { emoji: emojis.emojisay })}`)
        .setDescription(
          `${t('commands:botinfo:embed.desc', {
            emoji: emojis.emojicerto,
            membro: interaction.member,
            botname: client.user.username,
            idowner: kyo.id,
            brunotag: kyo.tag,
          })}`
        )
        .addFields(
          {
            name: `${t('commands:botinfo:embed.field1name', { emoji: emojis.emojiusers })}`,
            value: `${t('commands:botinfo:embed.filed1desc', {
              tagbruno: bruno.tag,
              brunoid: bruno.id,
              coldztag: coldz.tag,
              coldzid: coldz.id,
              gzntag: gzn.tag,
              gznid: gzn.id,
              bigtag: big.tag,
              bigid: big.id,
              lucktag: luck.tag,
              luckid: luck.id,
              babiztag: babiz.tag,
              babizid: babiz.id,
            })}`,
            inline: false,
          },
          {
            name: `${t('commands:botinfo:embed.filed2name', { emoji: emojis.emojipasta })}`,
            value: `${t('commands:botinfo:embed.filed2desc', {
              users: require('currency-formatter').format(client.users.cache.size, {
                code: 'de-DE',
                symbol: '',
                precision: 0,
              }),
              servers: require('currency-formatter').format(client.guilds.cache.size, {
                code: 'de-DE',
                symbol: '',
                precision: 0,
              }),
              commanduses: require('currency-formatter').format(cliente.commanduses, {
                code: 'de-DE',
                symbol: '',
                precision: 0,
              }),
              canaistotais: require('currency-formatter').format(client.channels.cache.size, {
                code: 'de-DE',
                symbol: '',
                precision: 0,
              }),
              channelconect: require('currency-formatter').format(quantidadecanaisconectado, {
                code: 'de-DE',
                symbol: '',
                precision: 0,
              }),
            })}`,
            inline: false,
          },
          {
            name: `${t('commands:botinfo:embed.filed3name', { emoji: emojis.emojirobo })}`,
            value: `${t('commands:botinfo:embed.filed3desc', {
              memoryuse: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
              uptime: moment.duration(client.uptime).format(`${t('commands:botinfo:embed.daysformat')}`),
              memorytotal: (os.totalmem() / 1024 / 1024).toFixed(2),
              version: version,
              versionode: process.version,
              cpu: os.cpus().map((i) => `${i.model}`)[0],
              usecpu: percent.toFixed(2),
              bits: os.arch(),
              plataform: os.platform(),
              ping: client.ws.ping,
            })}`,
            inline: true,
          }
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
      return interaction.reply({ embeds: [embedbotinfo], components: [row] })
    })
  },
}
