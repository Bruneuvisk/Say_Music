const { MessageEmbed } = require('discord.js')
const config = require('../Interfaces/config.json')

module.exports = class EmbedSay extends MessageEmbed {
  constructor(user, t, data = {}) {
    super(data)
    this.setTimestamp()
    this.setColor(config.color)
    this.setFooter(
      `${t('commands:footerembed.message', { membro: `${user.username}#${user.discriminator}` })}`,
      user.displayAvatarURL({ dynamic: true })
    )
  }
}
