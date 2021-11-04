const { Client, Collection, Intents } = require('discord.js')
const config = require('../Interfaces/config.json')
const Guild = require('../Database/Schemas/Guild')
const Locale = require('../../Lib/Locale')

class SayMusic extends Client {
  constructor(options) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
      ],
    })
    this.database = new Collection()
    this.commands = new Collection()
    this.cooldowns = new Collection()
    this.slashCommands = new Collection()
  }

  login(token) {
    token = config.token
    return super.login(token)
  }

  async getLanguage(firstGuild) {
    if (!firstGuild) return
    const guild = await Guild.findOne({
      idServer: !isNaN(firstGuild) ? firstGuild : firstGuild.id,
    })

    if (guild) {
      let lang = guild.language

      if (lang === undefined) {
        guild.language = 'pt-BR'
        guild.save()

        return 'pt-BR'
      } else {
        return lang
      }
    } else {
      await Guild.create({ idServer: firstGuild.id })

      return 'pt-BR'
    }
  }

  async getActualLocale() {
    return this.t
  }

  async setActualLocale(locale) {
    this.t = locale
  }

  async getTranslate(guild) {
    const language = await this.getLanguage(guild)

    const translate = new Locale('src/Languages')

    const t = await translate.init({
      returnUndefined: false,
    })

    translate.setLang(language)

    return t
  }
}

module.exports.SayMusic = SayMusic
