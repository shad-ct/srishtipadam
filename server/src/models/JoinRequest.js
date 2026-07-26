const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  district: { type: String, required: true },
  mobile: { type: String, required: true },
  reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
