const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  writer: { type: String, required: true },
  price: { type: Number, required: true },
  pages: { type: Number },
  description: {
    ml: { type: String },
    en: { type: String }
  },
  coverImage: {
    url: String,
    publicId: String
  },
  category: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
