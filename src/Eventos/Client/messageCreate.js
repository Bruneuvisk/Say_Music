const { ActionRowBuilder, ButtonStyle, ButtonBuilder, Message, Client } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const config = require('../../Interfaces/config.json')
const emojis = require('../../Interfaces/emojis.json')
const { getPrefix } = require('../../Struturas/Functions')
let t
const coldoown = new Set();

module.exports ={
  name: "messageCreate",
  /**
  * 
  * @param {Client} client 
  * @param {Message} message 
  * @returns 
  */
  run: async (client, message) => {
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

      let embedsay = new ButtonBuilder()
          .setLabel(`${t('commands:errorslash.button')}`)
          .setEmoji("💜")
          .setURL("https://discord.com/api/oauth2/authorize?client_id=870200133642485802&permissions=2482367856&scope=bot%20applications.commands")
          .setStyle(ButtonStyle.Link)

      let row = new ActionRowBuilder()
        .addComponents(embedsay)

      const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
      if (message.content.match(mention)) {
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

      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);

      if (!prefixRegex.test(message.content)) return

      const [matchedPrefix] = message.content.match(prefixRegex);

      const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase()
      const command =
        client.commands.get(commandName) ||
        client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

      if(!command) return

      const cooldownAmount = (command.cooldown || 3) * 1000

      if (coldoown.has(message.author.id)) {
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

      if (command) {
        return message.reply({ content: `${t('commands:errorslash.message', { emoji: emojis.emojicoroa })}`, components: [row] })
      }

      command.run({ client, message, args, prefix, color, language }, t)

      if (!["469661232153231385"].includes(message.author.id)) {
        coldoown.add(message.author.id);
        setTimeout(() => {
          coldoown.delete(message.author.id);
        }, cooldownAmount);
      }
    } catch (err) {
      if (err) console.error(err)
    }
  }
}
