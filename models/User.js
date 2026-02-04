const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Utilisation d'un Enum avec les rôles demandés
  role: { 
    type: String, 
    required: true, 
    uppercase: true, 
    enum: ['ADMIN', 'BUYERS', 'ADMINSHOP'],
    default: 'BUYERS'
  },
  permission: [{ type: String }],
  status: { type: String, required: true, uppercase: true, default: 'ACTIVE' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);