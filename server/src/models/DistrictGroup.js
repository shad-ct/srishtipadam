const mongoose = require('mongoose');

const districtGroupSchema = new mongoose.Schema({
  district: { type: String, required: true },
  whatsappNumber: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DistrictGroup', districtGroupSchema);
