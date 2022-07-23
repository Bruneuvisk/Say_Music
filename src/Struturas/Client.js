const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js')
const Guild = require('../Database/Schemas/Guild')
const Locale = require('../../Lib/Locale')
const SayLavaMusic = require("../Struturas/Lavalink")

class SayMusic extends Client {
  constructor(options) {
    super({
      allowedMentions: {
        everyone: false,
        roles: false,
        users: false
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,

      ],
      partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
    })
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.config = require("../Interfaces/config.json");
    this.aliases = new Collection();
    this.commands = new Collection();
    this.database = new Collection();
    this.logger = require("../Utils/logger");
    if (!this.token) this.token = this.config.token;
    this.manager = new SayLavaMusic(this)

    this.rest.on('rateLimited', (info) => {
      this.logger.log('ratelimit', "log");
    })
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

  connect() {
    return super.login(this.token);
  };
}

module.exports.SayMusic = SayMusic
