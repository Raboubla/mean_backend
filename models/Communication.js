const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, required: true, uppercase: true },
  target: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  image_url: { type: String },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }
});

module.exports = mongoose.model('Communication', communicationSchema);