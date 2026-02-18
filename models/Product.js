const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },

  // Utilisation de Decimal128 pour la précision financière (Cyber S7 standard)
  price: { type: mongoose.Types.Decimal128, required: true },

  // Category Enum (Single value as per your schema)
  category: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ELECTRONICS', 'CLOTHING', 'HOME', 'FOOD', 'TOYS', 'BEAUTY', 'OTHER'],
    default: 'OTHER'
  },

  // Product Status Enum
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED', 'PRE_ORDER'],
    default: 'AVAILABLE'
  },

  is_active: { type: Boolean, default: true },
  image_url: { type: String },

  // Relation avec le Shop
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  promotion: {
    discount_percent: { type: Number },
    promo_price: { type: mongoose.Types.Decimal128 },
    end_date: { type: Date }
  },


});

module.exports = mongoose.model('Product', productSchema);