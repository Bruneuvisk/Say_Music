const { readdirSync } = require('fs');
const { PermissionsBitField, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = (client) => {
    const data = [];
    let count = 0;
    readdirSync("./src/ComandosSlash/").forEach((dir) => {
        const slashCommandFile = readdirSync(`./src/ComandosSlash/${dir}/`).filter((files) => files.endsWith(".js"));

        for (const file of slashCommandFile) {
            const slashCommand = require(`../ComandosSlash/${dir}/${file}`);

            if (!slashCommand.name) return console.error(`slashCommandNameError: ${slashCommand.split(".")[0]} application command name is required.`);

            if (!slashCommand.description) return console.error(`slashCommandDescriptionError: ${slashCommand.split(".")[0]} application command description is required.`);

            client.slashCommands.set(slashCommand.name, slashCommand);

            data.push({
                name: slashCommand.name,
                description: slashCommand.description,
                type: slashCommand.type,
                options: slashCommand.options ? slashCommand.options : null,
                default_userPerms: slashCommand.memberperm ? slashCommand.memberperm : null,
                default_member_permissions: slashCommand.memberperm ? PermissionsBitField.resolve(slashCommand.memberperm).toString() : null,
            });
            count++;
        }
    });
    client.logger.log(`Todos os comando de (/) da say foram carregados: ${count}`, "cmd");
    const rest = new REST({ version: '10' }).setToken(client.config.token);
    (async () => {
        try {
            client.logger.log('Iniciado o processo de recarregamento dos comandos de (/).', 'cmd');
            await rest.put(Routes.applicationCommands("1000458337453867038"), { body: data });
            client.logger.log('Todos os comandos de (/) foram carregados com sucesso.', 'cmd');
        } catch (error) {
            console.error(error);
        }
    })();
}