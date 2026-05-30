const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true },
  category:   { type: String, default: 'General' },
  quantity:   { type: Number, required: true, min: 0 },
  unit:       { type: String, default: 'units' },
  minStock:   { type: Number, default: 1 },
  expiryDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('GroceryItem', groceryItemSchema);