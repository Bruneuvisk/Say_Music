


module.exports = async (client, node, reason) => {
    client.logger.log(`O Lavalink ${node.options.identifier} foi desconectado pelo morivo ${reason}.`, "warn")
}