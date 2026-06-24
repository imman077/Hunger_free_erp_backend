import mongoose from 'mongoose';

const gamificationTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['DONOR', 'NGO', 'VOLUNTEER'], default: 'DONOR' },
  range: { type: String, required: true },
  bonus: { type: String, required: true },
  pointsRequired: { type: Number, required: true },
  perks: { type: String, required: true },
  color: { type: String, required: true }
}, {
  timestamps: true
});

export const GamificationTier = mongoose.model('GamificationTier', gamificationTierSchema);
