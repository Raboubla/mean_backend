const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },

  // Type Enum en anglais (Single value)
  type: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ANNOUNCEMENT', 'EVENT'], // "Annonce" ou "Event" en anglais
    default: 'ANNOUNCEMENT'
  },

  // Target audience (ex: "ALL", "BUYERS", "SHOP_OWNERS")
  target: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ALL', 'BUYERS', 'SHOP_ADMINS'],
    default: 'ALL'
  },

  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  image_url: { type: String },

  // Relation optionnelle (si la comm vient d'un shop spécifique)
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }
}, { timestamps: true });

module.exports = mongoose.model('Communication', communicationSchema);