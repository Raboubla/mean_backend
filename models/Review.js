const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  status: { type: String, default: 'PENDING', uppercase: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);