const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: [{ type: String, required: true }],
  description: { type: String },
  status: { type: String, required: true },
  floor: { type: Number, required: true },
  view_count: { type: Number, default: 0 },
  opening_hours: [{
    day: { type: String, required: true },
    open: { type: String, required: true },
    close: { type: String, required: true }
  }]
});

module.exports = mongoose.model('Shop', shopSchema);