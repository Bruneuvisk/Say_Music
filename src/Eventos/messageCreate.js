const { MessageEmbed, Permissions, Collection, WebhookClient, MessageActionRow, MessageButton } = require('discord.js')
const EmbedSay = require('../Struturas/EmbedSay')
const config = require('../Interfaces/config.json')
const emojis = require('../Interfaces/emojis.json')
const { getPrefix } = require('../Struturas/Functions')
let t

module.exports = async (client, message) => {
  try {
    if (message.author.bot == true) return
    const prefix = await getPrefix(message.guild.id, client)
    const color = config.color
    const language = await client.getLanguage(message.guild.id)

    try {
      t = await client.getTranslate(message.guild.id)
    } catch (e) {
      console.error(e)
    }

    const server = await client.database.servidores.findOne({
      idServer: message.guild.id,
    })

    const cliente = await client.database.cliente.findOne({
      _id: client.user.id,
    })

    if (!server) {
      await client.database.servidores.create({
        idServer: message.guild.id,
      })
    }

    if (!cliente) {
      await client.database.cliente.create({
        _id: client.user.id,
        reason: '',
        manutenção: false,
      })
    }

    let embedsay = new MessageButton()
        .setLabel(`${t('commands:errorslash.button')}`)
        .setEmoji("💜")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=870200133642485802&permissions=8589934583&scope=bot%20applications.commands")
        .setStyle("LINK")

    let row = new MessageActionRow()
      .addComponents(embedsay)

    if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) {
      let embedzinhasay = new EmbedSay(message.author, t)
        .setTitle(`${emojis.emojisay} | ${t('commands:marcacao.title')}`)
        .setDescription(
          `${emojis.emojicerto}・${t('commands:marcacao.description1', { membro: message.author.id })} \n\n ${
            emojis.emojisetinha
          }・${t('commands:marcacao.description2')} \n ${emojis.emojisetinha}・${t('commands:marcacao.description3')}`
        )
        .setThumbnail(client.user.displayAvatarURL())
      return message.reply({ embeds: [embedzinhasay] })
    }

    if (message.content.indexOf(prefix) !== 0) return
    if (!message.content.startsWith(prefix)) return

    const args = message.content.slice(prefix.length).trim().split(/ +/g)
    const commandName = args.shift().toLowerCase()
    const command =
      client.commands.get(commandName) ||
      client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if(!command) return

    if (!client.cooldowns.has(command.name)) {
      client.cooldowns.set(command.name, new Collection())
    }

    const now = Date.now()
    const timestamps = client.cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000
        let embedtime = new EmbedSay(message.author, t)
          .setDescription(
            `${t('commands:cooldown.message', {
              emoji: emojis.emojitempo,
              membro: message.author,
              tempo: timeLeft.toFixed(1),
              comando: command.name,
            })}`
          )
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
        return message.reply({ ephemeral: true, embeds: [embedtime] })
      }
    }

    if (command) {
      return message.reply({ content: `${t('commands:errorslash.message', { emoji: emojis.emojicoroa })}`, components: [row] })
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    command.run({ client, message, args, prefix, color, language }, t)
  } catch (err) {
    if (err) console.error(err)
  }
}
