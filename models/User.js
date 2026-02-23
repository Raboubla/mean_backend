const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Single Role (ARR unchecked in Moon Modeler)
  role: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ADMIN', 'BUYER', 'SHOP_ADMIN'],
    default: 'SHOP_ADMIN'
  },

  // Multiple Permissions (ARR checked)
  permission: [{
    type: String,
    uppercase: true,
    enum: ['CASHIER', 'MASCOT', 'SELLER', 'RECEPTIONIST', 'ADMIN']
  }],

  // Account Status
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['ACTIVE', 'INACTIVE', 'BANNED', 'PENDING'],
    default: 'ACTIVE'
  },

  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  created_at: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);