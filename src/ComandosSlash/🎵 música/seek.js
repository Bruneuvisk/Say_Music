const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar } = require('../../Struturas/Functions')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'seek',
  description: 'Altera a posição da música que está sendo tocada em segundos',
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
    {
      Integer: {
        name: 'tempo_segundos',
        description: 'Quanto tempo em segundos deseja mudar a música?',
        required: true,
      },
    }, //to use in the code: interacton.getInteger("ping_amount")
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

    const timeSecond = options.getInteger('tempo_segundos')

    let player = await client.manager.players.get(interaction.guild.id)
    const { channel } = interaction.member.voice;

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
      player && channel.id !== player.voiceChannel
    ) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:8d:notbot', { emoji: emojis.emojierror, membro: interaction.member })}`,
      })
    }

    if (Number(timeSecond) < 0 || Number(timeSecond) >= player.queue.current.duration / 1000) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:seek:error', { emoji: emojis.emojierror, duration: player.queue.current.duration })}`,
      })
    }

    player.seek(Number(timeSecond) * 1000)

    let embedseek = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:seek:embed.title', {
          emoji: emojis.emojicerto,
          time: prettyMilliseconds(Number(timeSecond) * 1000, { colonNotation: true }),
        })}`
      )
      .setDescription(`${t('commands:seek:embed.desc', { emoji: emojis.emojisetinha, bar: createBar(player) })}`)

    return interaction.reply({ embeds: [embedseek] })
  },
}
