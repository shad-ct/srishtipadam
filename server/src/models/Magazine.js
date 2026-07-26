const mongoose = require('mongoose');

const magazineSchema = new mongoose.Schema({
  title: { ml: String, en: String },
  description: { ml: String, en: String },
  coverImage: { url: String, publicId: String },
  pdf: { url: String, publicId: String },
  issueNumber: { type: String },
  publishedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Magazine', magazineSchema);
