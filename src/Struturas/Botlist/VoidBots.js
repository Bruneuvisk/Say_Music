const config = require("../../Interfaces/config.json")
const { MessageEmbed, WebhookClient } = require('discord.js')
const express = require("express")

module.exports = (client) => {
    const app = express()
    const PORT = 1500

    app.use(express.json())

    app.post("/voted", async (req, res) => {
        console.log(req.body)

        if (req.header('Authorization') != config.webhookvoid.token) {
            return res.status("401").end();
        }

        console.log(`${req.body.user} has voted for ${req.body.bot} on voidbots.net`);

        const user = await client.users.fetch(req.body.user)

        const Webhook = new WebhookClient({
            id: config.webhookvoid.id,
            token: config.webhookvoid.token,
        })

        const EMBED_COMMANDS = new MessageEmbed()
            .setAuthor(`Votos Say`, !user ? client.user.displayAvatarURL() : user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${emojis.emojicerto} | Obrigado <@${req.body.user}> por votar em mim  isso me ajuda demais você não tem ideia, obrigado fofo.`)
            .setTimestamp()
            .setColor(config.color)
            .setFooter(req.body.user, !user ? client.user.displayAvatarURL() : user.displayAvatarURL({ dynamic: true }))
            .setThumbnail(!user ? client.user.displayAvatarURL() : user.displayAvatarURL({ dynamic: true }))
        Webhook.send({ content: `<@${req.body.user}>`, embeds: [EMBED_COMMANDS] })

        if(user) {
            user.send({ embeds: [EMBED_COMMANDS] })
        }

        res.status(200).end()
    })

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}