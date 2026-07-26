const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  bookNameSnapshot: { type: String, required: true },
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "contacted", "fulfilled", "cancelled"],
    default: "pending"
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
