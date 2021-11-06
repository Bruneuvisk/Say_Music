const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { createBar } = require('../../Struturas/Functions')

module.exports = {
  name: 'queuestatus',
  description: 'Mostra os status da sua atual fila de músicas',
  cooldown: 10,
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

    let embedqueue = new EmbedSay(interaction.member.user, t)
      .setTitle(
        `${t('commands:queuestatus:embed.title', {
          emoji: emojis.emojicerto,
          name: client.channels.cache.get(player.voiceChannel).name,
        })}`
      )
      .setDescription(
        `${t('commands:queuestatus:embed.desc', {
          emoji: emojis.emojisetinha,
          textname: client.channels.cache.get(player.textChannel).name,
          length: player.queue.length,
        })}`
      )
      .addFields(
        {
          name: `${t('commands:queuestatus:embed.filed1name', { emoji: emojis.emojisetinha })}`,
          value: `${player.volume}%`,
          inline: true,
        },
        {
          name: `${t('commands:queuestatus:embed.filed2name', { emoji: emojis.emojisetinha })}`,
          value: `8D ${player.eightD ? `${emojis.emojicerto}` : `${emojis.emojierror}`} \n BassBoost ${
            player.bassboost ? `${emojis.emojicerto}` : `${emojis.emojierror}`
          } \n Karaoke ${player.karaoke ? `${emojis.emojicerto}` : `${emojis.emojierror}`} \n Nightcore ${
            player.nightcore ? `${emojis.emojicerto}` : `${emojis.emojierror}`
          } \n Pop ${player.pop ? `${emojis.emojicerto}` : `${emojis.emojierror}`} \n Soft ${
            player.soft ? `${emojis.emojicerto}` : `${emojis.emojierror}`
          } \n Treblebass ${player.treblebass ? `${emojis.emojicerto}` : `${emojis.emojierror}`} \n Tremolo ${
            player.tremolo ? `${emojis.emojicerto}` : `${emojis.emojierror}`
          } \n Vaporwave ${player.vaporwave ? `${emojis.emojicerto}` : `${emojis.emojierror}`} \n Vibrato ${
            player.vibrato ? `${emojis.emojicerto}` : `${emojis.emojierror}`
          }`,
          inline: true,
        },
        {
          name: `${t('commands:queuestatus:embed.filed3name', { emoji: emojis.emojisetinha })}`,
          value: `${player.queueRepeat ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
          inline: true,
        },
        {
          name: `${t('commands:queuestatus:embed.filed4name', { emoji: emojis.emojisetinha })}`,
          value: `${player.trackRepeat ? `${emojis.emojicerto}` : `${emojis.emojierror}`}`,
          inline: true,
        },
        {
          name: `${t('commands:queuestatus:embed.filed5name', { emoji: emojis.emojisetinha })}`,
          value: `[**${player.queue.current.title}**](${player.queue.current.uri})`,
          inline: true,
        },
        {
          name: `${t('commands:queuestatus:embed.filed6name', { emoji: emojis.emojisetinha })}`,
          value: `${createBar(player)}`,
          inline: true,
        }
      )
    return interaction.reply({ embeds: [embedqueue] })
  },
}
