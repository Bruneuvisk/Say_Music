const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar, paginateItens } = require('../../Struturas/Functions')
const _ = require('lodash')
const { format } = require('../../Struturas/Functions')

module.exports = {
  name: 'queue',
  description: 'Lista a fila de músicas atual no servidor',
  cooldown: 15,
  memberperm: [Permissions.FLAGS.SEND_MESSAGES, Permissions.FLAGS.USE_APPLICATION_COMMANDS],
  clientperm: [
    Permissions.FLAGS.EMBED_LINKS,
    Permissions.FLAGS.SEND_MESSAGES,
    Permissions.FLAGS.USE_APPLICATION_COMMANDS,
  ],
  requiredroles: [],
  alloweduserids: [],
  options: [
    //{"Integer": { name: "tempo_segundos", description: "Quanto tempo em segundos deseja avançar a música?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    //{ String: { name: 'nome_musica', description: 'Qual música deseja exibir a letra?', required: false } }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "qual_ping", description: "Qual ping você quer saber sobre mim?", required: true, choices: [["bot", "botping"], ["Discord Api", "discord_api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async ({ client, interaction, prefix, color, emojis, language }, t) => {
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

    let player = await client.manager.players.get(interaction.guild.id)

    if (!player) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notocad', { emoji: emojis.emojierror })}`,
      })
    }

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notchannel', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId != interaction.guild.me.voice.channelId
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:queue:embedinicio.title', { emoji: emojis.emojicoroa })}`)
        .setDescription(
          `${t('commands:queue:embedinicio.desc', {
            emoji: emojis.emojicerto,
            emojiseta: emojis.emojisetinha,
            titleplayer: player.queue.current.title,
            uriplayer: player.queue.current.uri,
            requester: player.queue.current.requester,
            bar: createBar(player),
          })}`
        )
      return interaction.reply({ embeds: [QueueEmbed] })
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index
      return t
    })

    let ChunkedSongs = _.chunk(Songs, 10)

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (te) =>
          `\`${te.index + 1}.\` [${te.title}](${te.uri}) \n \`${format(te.duration)}\`${t('commands:queue:filearray')}${
            te.requester
          }\n`
      ).join('\n')

      let Embed = new EmbedSay(interaction.member.user, t)
        .setTitle(`${t('commands:queue:embedinicio.title', { emoji: emojis.emojicoroa })}`)
        .setDescription(
          `${t('commands:queue:embedinicio.desc2', {
            emoji: emojis.emojicerto,
            emojiseta: emojis.emojisetinha,
            titleplayer: player.queue.current.title,
            uriplayer: player.queue.current.uri,
            description: SongsDescription,
            sizequeue: player.queue.totalSize - 1,
            duration: format(player.queue.duration),
            requester: player.queue.current.requester,
            bar: createBar(player),
          })}`
        )
      return Embed
    })

    if (!Pages.length || Pages.length === 1) return interaction.reply({ embeds: [Pages[0]] })
    else paginateItens(interaction, Pages)
  },
}
