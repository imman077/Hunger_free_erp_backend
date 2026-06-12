import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  subCategory: String,
  verificationLevel: { type: String, default: 'Level I' },
  registrationId: String,
  profileCompleteness: { type: Number, default: 0 },
  legalName: String,
  website: String,
  entityType: String,
  taxId: String,
  primaryManagerName: String,
  primaryManagerEmail: String,
  alternateContact: String,
  address: {
    line1: String,
    line2: String,
    city: String,
    district: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'India' }
  },
  totalDonationsCount: { type: Number, default: 0 },
  donationPoints: { type: Number, default: 0 },
  status: { type: String, default: 'Active' }
}, {
  timestamps: true
});

export const Donor = mongoose.model('Donor', donorSchema);
