const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { ml: String, en: String },
  phone: { type: String },
  photo: { url: String, publicId: String },
  image: { type: String },
  facebook: { type: String },
  whatsapp: { type: String },
  phoneNumber: { type: String },
  description: { ml: String, en: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);
