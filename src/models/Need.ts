import mongoose from 'mongoose';

const needSchema = new mongoose.Schema({
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'Units' },
  urgency: { type: String, default: 'Medium Priority' },
  requiredBy: Date,
  image: String,
  distributionAddress: String,
  description: String,
  status: { type: String, default: 'Open' },
  fulfilledQuantity: { type: Number, default: 0 },
  supporterIds: [String]
}, {
  timestamps: true
});

export const Need = mongoose.model('Need', needSchema);
