const c = require('colors')

module.exports = async (client) => {
  client.manager
    .on('nodeConnect', (node) => {
      console.log(c.green(`[LAVALINK] - O Lavalink ${node.options.identifier} foi conectado com sucesso`))
    })
    .on('nodeCreate', (node) => {
      console.log(c.green(`[LAVALINK] - O Lavalink ${node.options.identifier} foi criado com sucesso`))
    })
    .on('nodeReconnect', (node) => {
      console.log(c.green(`[LAVALINK] - O Lavalink foi reconectado no ${node.options.identifier}`))
    })
    .on('nodeDisconnect', (node) => {
      console.log(c.red(`[LAVALINK] - O Lavalink ${node.options.identifier} foi desconectado`))
    })
    .on('nodeError', (node, error) => {
      console.log(c.red(`[LAVALINK] - O Lavalink ${node.options.identifier} ocorreu um error: ${error.message}`))
    })
}
