const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  // fix: add product on sales, sorry stefan
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: mongoose.Types.Decimal128, required: true },
  total_price: { type: mongoose.Types.Decimal128, required: true },
  sold_at: { type: Date, default: Date.now },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Sales', salesSchema);