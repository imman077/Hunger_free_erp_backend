import mongoose from 'mongoose';

// ─── Config Item (dropdown options managed by admin) ─────────────────────────
const configItemSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. 'foodCategories', 'donationStatuses'
  name: { type: String, required: true },
  description: String,
  color: String,
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 }
}, { timestamps: true });

export const ConfigItem = mongoose.model('ConfigItem', configItemSchema);

// ─── Category Suggestion ──────────────────────────────────────────────────────
const categorySuggestionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }, // 'cooked_food', 'ngo', 'volunteer_skill'
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const CategorySuggestion = mongoose.model('CategorySuggestion', categorySuggestionSchema);

// ─── Milestone / Badge Config ─────────────────────────────────────────────────
const milestoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: String,
  category: { type: String, required: true }, // 'donors', 'ngos', 'volunteers'
  requirementType: { type: String, required: true }, // 'donations', 'points', 'streaks', 'deliveries'
  threshold: { type: Number, required: true },
  icon: { type: String, default: 'Award' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const Milestone = mongoose.model('Milestone', milestoneSchema);

// ─── Points Tier ──────────────────────────────────────────────────────────────
const pointsTierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // 'DONOR', 'NGO', 'VOLUNTEER'
  minPoints: { type: Number, required: true },
  maxPoints: Number,
  color: String,
  benefits: [String],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const PointsTier = mongoose.model('PointsTier', pointsTierSchema);

// ─── Reward Claim ─────────────────────────────────────────────────────────────
const rewardClaimSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
  status: { type: String, default: 'Pending' }, // 'Pending', 'Approved', 'Rejected', 'Fulfilled'
  claimedAt: { type: Date, default: Date.now },
  processedAt: Date
}, { timestamps: true });

export const RewardClaim = mongoose.model('RewardClaim', rewardClaimSchema);
