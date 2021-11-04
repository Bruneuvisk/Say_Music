const mongoose = require('mongoose')
const Schema = mongoose.Schema

let queueSchema = new Schema({
  idUser: { type: String },
  nameQueue: { type: String },
  musics: { type: Array, default: [] },
})

let Queue = mongoose.model('queues', queueSchema)
module.exports = Queue
