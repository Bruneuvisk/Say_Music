const { MessageEmbed, Permissions, MessageSelectMenu, MessageActionRow } = require('discord.js')
const EmbedSay = require('../../Struturas/EmbedSay')
const { arrayMove } = require('../../Struturas/Functions')

module.exports = {
  name: 'move',
  description: 'Troca a posição de uma música na fila pra outro posição',
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
    { Integer: { name: 'posição_da_musica', description: 'Envie a posição da música que quer mudar', required: true } },
    { Integer: { name: 'posição_final', description: 'Pra qual posição deseja colocar sua música?', required: true } }, //to use in the code: interacton.getInteger("ping_amount")
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

    const toposition = options.getInteger('posição_da_musica')
    const fromposition = options.getInteger('posição_final')

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

    if (isNaN(toposition) || toposition <= 1 || toposition > player.queue.length) {
      return interaction.reply({
        ephemeral: true,
        content: `${t('commands:move:errornoposition', { emoji: emojis.emojierror })}`,
      })
    }

    let song = player.queue[player.queue.length - 1]

    let QueueArray = arrayMove(player.queue, player.queue.length - 1, 0)

    player.queue.clear()

    for (const track of QueueArray) player.queue.add(track)

    let embedzinho = new EmbedSay(interaction.member.user, t)
      .setDescription(`${t('commands:move:sucess', { emoji: emojis.emojicerto, to: toposition, from: fromposition })}`)
      .setTitle(`[${song.title}](${song.uri})`)
      .setThumbnail(song.displayThumbnail())

    return interaction.reply({ embeds: [embedzinho] })
  },
}
