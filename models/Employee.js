const mongoose = require('mongoose')
const { nanoid }= require('nanoid')
const uuid = require('uuid');

const schema = mongoose.Schema({
  Key: { type: String, default: "Employee"},
  name: { type: String, required: true, unique: true },
  days_worked: { type: Number, default: 0 },
  cafe: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafe', required: true },
  id: { type: String, unique: true }
}, { versionKey: false })

module.exports = mongoose.model('Employee', schema)
