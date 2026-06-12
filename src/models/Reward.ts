import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  pointsRequired: { type: Number, required: true },
  category: { type: String, required: true },
  role: { type: String, enum: ['DONOR', 'NGO', 'VOLUNTEER'], default: 'NGO' },
  amount: String,
  available: { type: Boolean, default: true },
  image_url: String,
  status: { type: String, default: 'Active' }
}, {
  timestamps: true
});

export const Reward = mongoose.model('Reward', rewardSchema);
