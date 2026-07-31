const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: { en: String, ml: String },
  writer: { en: String, ml: String },
  price: { type: Number, required: true, min: 0 },
  pages: { type: Number },
  description: {
    ml: { type: String },
    en: { type: String }
  },
  coverImage: { type: String },
  category: { type: String },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
