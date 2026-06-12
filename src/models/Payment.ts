import mongoose from 'mongoose';

const bankAccountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bankName: { type: String, required: true },
  accountHolder: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifscCode: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false }
}, {
  timestamps: true
});

export const BankAccount = mongoose.model('BankAccount', bankAccountSchema);

const upiIdentitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vpa: { type: String, required: true },
  label: { type: String, default: 'Primary' },
  isPrimary: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const UPIIdentity = mongoose.model('UPIIdentity', upiIdentitySchema);
