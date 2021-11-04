const mongoose = require('mongoose')
const Schema = mongoose.Schema

let guildSchema = new Schema({
  idServer: { type: String },
  prefix: { type: String, default: 's*' },
  language: { type: String, default: 'pt-BR' },
  cmdblock: {
    channels: { type: Array, default: [] },
    cmds: { type: Array, default: [] },
  },
  settings: {
    djroles: { type: Array, default: [] },
    commandsdj: { type: Array, default: [] },
  },
})

let Guild = mongoose.model('Guilds', guildSchema)
module.exports = Guild
