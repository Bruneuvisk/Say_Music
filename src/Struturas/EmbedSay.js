const { EmbedBuilder } = require('discord.js')
const config = require('../Interfaces/config.json')

module.exports = class EmbedSay extends EmbedBuilder {
  constructor(user, t, data = {}) {
    super(data)
    this.setTimestamp()
    this.setColor(config.color)
    this.setFooter(
      { text: `${t('commands:footerembed.message', { membro: `${user.username}#${user.discriminator}` })}`, iconURL: user.displayAvatarURL({ dynamic: true }) },
    )
  }
}
