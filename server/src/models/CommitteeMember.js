const mongoose = require('mongoose');

const committeeMemberSchema = new mongoose.Schema({
  name: { en: String, ml: String },
  role: { ml: String, en: String },
  phone: { type: String, maxlength: 10 },
  photo: { url: String, publicId: String },
  image: { type: String },
  facebook: { type: String },
  whatsapp: { type: String, maxlength: 10 },
  phoneNumber: { type: String, maxlength: 10 },
  description: { ml: String, en: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('CommitteeMember', committeeMemberSchema);
