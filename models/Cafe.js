const mongoose = require('mongoose')
const uuid = require('uuid');

const schema = mongoose.Schema({
  Key: { type: String, default: 'Cafe'},
  name: { type: String, required: true },
  description: { type: String, required: true },
  employees: { type: Number, default: 0 },
  logo: { type: String, required: true },
  location: { type: String, required: true },
  id: { type: String, unique: true }
}, { versionKey: false })

module.exports = mongoose.model('Cafe', schema)
