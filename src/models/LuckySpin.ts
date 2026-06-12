import mongoose from 'mongoose';

const luckySpinPrizeSchema = new mongoose.Schema({
  role: { type: String, required: true },
  label: { type: String, required: true },
  prizeType: { type: String, default: 'CASH' },
  value: { type: Number, default: 0 },
  icon: String,
  probability: { type: Number, default: 0.1 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const LuckySpinPrize = mongoose.model('LuckySpinPrize', luckySpinPrizeSchema);

const luckySpinDrawSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prize: { type: mongoose.Schema.Types.ObjectId, ref: 'LuckySpinPrize', required: true },
  drawnAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const LuckySpinDraw = mongoose.model('LuckySpinDraw', luckySpinDrawSchema);
