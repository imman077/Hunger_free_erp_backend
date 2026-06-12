import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerType: { type: String, enum: ['DONOR', 'NGO'], required: true },
  documentType: { type: String, required: true },
  documentId: String,
  fileUrl: String,
  isVerified: { type: Boolean, default: false },
  expiryDate: Date,
  uploadedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Document = mongoose.model('Document', documentSchema);
