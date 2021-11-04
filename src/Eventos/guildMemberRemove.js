


module.exports = async (client, member) => {
    setInterval(() => {
        let guilch = client.guilds.cache.get("768702252357386240")
        let channel = guilch.channels.cache.get("905306427214675988")
        channel.setName(`📁・Usuários: ${client.users.cache.size}`)
    }, 900000)
}