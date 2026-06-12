import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  registrationId: { type: String, required: true },
  category: { type: String, default: 'Social Service' },
  managingDirector: String,
  managingDirectorEmail: String,
  contactNumber: String,
  website: String,
  taxId: String,
  officeAddress: String,
  totalDonationsCount: { type: Number, default: 0 },
  beneficiariesHelpedCount: { type: Number, default: 0 },
  activeNeedsCount: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  currentTier: { type: String, default: 'Beginner' },
  status: { type: String, default: 'PENDING' }
}, {
  timestamps: true
});

export const NGO = mongoose.model('NGO', ngoSchema);
