const { readdirSync } = require('fs');

module.exports = (client) => {
    let count = 0;
    readdirSync("./src/Comandos/").forEach(dir => {
        const commandFiles = readdirSync(`./src/Comandos/${dir}/`).filter(f => f.endsWith('.js'));
        for (const file of commandFiles) {
            const command = require(`../Comandos/${dir}/${file}`);
            if (command.name) {
                client.commands.set(command.name, command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        client.aliases.set(alias, command.name)
                    })
                }
                count++;
            }
        }
    });
    client.logger.log(`Todos os ${count} comandos do bot foram carregados com sucesso`, "cmd");
}
