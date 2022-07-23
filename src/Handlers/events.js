const { readdirSync } = require('fs');

module.exports = (client) => {
    let count = 0;
    readdirSync("./src/Eventos/Client/").forEach(file => {
        const event = require(`../Eventos/Client/${file}`);
        client.on(event.name, (...args) => event.run(client, ...args));
        count++;
    });
    client.logger.log(`Os ${count} eventos foram carregados com sucesso`, "event");
}