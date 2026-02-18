const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Categories (ARR checked)
  category: [{
    type: String,
    required: true,
    uppercase: true,
    enum: ['FASHION', 'FOOD', 'ELECTRONICS', 'LEISURE', 'RESTAURANT', 'BEAUTY']
  }],

  description: { type: String },

  // Shop Status
  status: {
    type: String,
    required: true,
    uppercase: true,
    enum: ['OPEN', 'CLOSED', 'UNDER_RENOVATION', 'COMING_SOON'],
    default: 'OPEN'
  },

  floor: { type: Number, required: true },
  view_count: { type: Number, default: 0 },

  opening_hours: [{
    day: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    },
    open: { type: String, required: true }, // Format "09:00"
    close: { type: String, required: true } // Format "19:00"
  }],

  banner_url: { type: String }
});

module.exports = mongoose.model('Shop', shopSchema);