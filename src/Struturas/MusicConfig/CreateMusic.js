const { Manager, Structure } = require('erela.js')
const Deezer = require('erela.js-deezer')
const Spotify = require('erela.js-spotify')
const Facebook = require('erela.js-facebook')
const filter = require('erela.js-filters')
const { Message } = require('discord.js')
const config = require('../../Interfaces/config.json')

module.exports = async (client) => {
  let clientID = config.spotify.clientID
  let clientSecret = config.spotify.clientSecret

  const nodes = [
    {
      identifier: config.nodesPlayer.erelaid,

      host: config.nodesPlayer.erelahost,
      port: config.nodesPlayer.erelaport,
      password: config.nodesPlayer.erelapass,
      retryAmount: 30,
      retryDelay: 3000,
      secure: false,
    },
  ]

  client.manager = new Manager({
    nodes,
    plugins: [
      new Deezer(),
      new Facebook(),
      new filter(),
      new Spotify({
        clientID,
        clientSecret,
      }),
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id)
      if (guild) guild.shard.send(payload)
    },
  })

  Structure.extend(
    'Player',
    (Player) =>
      class extends Player {
        /**
         * Sets now playing message for deleting next time
         * @param {Message} message
         */
        setNowplayingMessage(message) {
          if (this.nowPlayingMessage) this.nowPlayingMessage.delete()
          return (this.nowPlayingMessage = message)
        }
      }
  )

  require('./EventsErela')(client)
  require('./EventsNode')(client)
}
