


module.exports = async (client, node, error) => {
    client.logger.log(`O Lavalink ${node.options.identifier} ocorreu um error: ${error.message}`, "error")
}