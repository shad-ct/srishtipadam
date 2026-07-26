const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: { ml: String, en: String },
  place: { ml: String, en: String },
  date: { type: Date, required: true },
  time: { type: String },
  description: { ml: String, en: String },
  images: [{ url: String, publicId: String }],
  videos: [{ url: String, publicId: String }],
  isUpcoming: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
