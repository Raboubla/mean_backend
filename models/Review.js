const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer_name: { type: String, required: true },

  // Note de 1 à 5
  rating: { type: Number, required: true, min: 1, max: 5 },

  comment: { type: String },

  // Status Enum
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SPAM'],
    default: 'PENDING'
  },

  // Relation avec la boutique concernée
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },

  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);