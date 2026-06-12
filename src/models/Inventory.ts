import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  expiryDate: Date,
  storageLocation: String,
  itemCondition: { type: String, default: 'Excellent' },
  status: { type: String, default: 'In Stock' },
  sourceDonation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' }
}, {
  timestamps: true
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
