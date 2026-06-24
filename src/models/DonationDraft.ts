import mongoose from 'mongoose';

const donationDraftSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  foodType: { type: String },
  category: { type: String },
  dietaryType: { type: String },
  preparationType: { type: String },
  quantity: { type: String },
  ngo: { type: String },
  donor: { type: String },
  date: { type: String },
  pickupAddress: { type: String },
  deliveryAddress: { type: String },
  description: { type: String },
  expiryTime: { type: String },
  image: { type: String },
  relatedNeed: { type: String }
}, {
  timestamps: true
});

export const DonationDraft = mongoose.model('DonationDraft', donationDraftSchema);
