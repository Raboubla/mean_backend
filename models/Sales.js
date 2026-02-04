const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  unit_price: { type: mongoose.Types.Decimal128, required: true },
  total_price: { type: mongoose.Types.Decimal128, required: true },
  sold_at: { type: Date, default: Date.now },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }
});

module.exports = mongoose.model('Sales', salesSchema);