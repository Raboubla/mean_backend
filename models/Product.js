const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: mongoose.Types.Decimal128, required: true },
  category: { type: String },
  status: { type: String, required: true, uppercase: true },
  is_active: { type: Boolean, default: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  promotion: {
    discount_percent: { type: Number },
    promo_price: { type: mongoose.Types.Decimal128 },
    end_date: { type: Date }
  }
});

module.exports = mongoose.model('Product', productSchema);