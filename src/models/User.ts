import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Core Identity
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  role: { type: String, enum: ['ADMIN', 'DONOR', 'NGO', 'VOLUNTEER'], default: 'DONOR' },
  avatar: String,
  phone: String,
  isVerified: { type: Boolean, default: false },

  // Role-Specific Profiles (Embedded - MongoDB Pattern)
  donorProfile: {
    businessName: String,
    businessType: String,
    subCategory: String,
    verificationLevel: { type: String, default: 'Level I' },
    registrationId: String,
    profileCompleteness: { type: Number, default: 0 },
    taxId: String,
    address: {
      line1: String,
      city: String,
      state: String,
      postalCode: String
    }
  },

  ngoProfile: {
    name: String,
    registrationId: String,
    category: { type: String, default: 'Social Service' },
    managingDirector: String,
    taxId: String,
    currentTier: { type: String, default: 'Beginner' },
    stats: {
      totalDonations: { type: Number, default: 0 },
      beneficiariesHelped: { type: Number, default: 0 },
      activeNeeds: { type: Number, default: 0 }
    }
  },

  volunteerProfile: {
    zone: String,
    skills: [String],
    rating: { type: Number, default: 0.0 },
    tasksCompleted: { type: Number, default: 0 },
    vehicleType: String,
    status: { type: String, default: 'available' }
  },

  // Embedded Related Data (Avoids multiple Joins)
  paymentMethods: {
    bankAccounts: [{
      bankName: String,
      accountHolder: String,
      accountNumber: String,
      ifscCode: String,
      isPrimary: Boolean
    }],
    upiIds: [{
      vpa: String,
      label: String,
      isPrimary: Boolean
    }]
  },

  gamification: {
    points: { type: Number, default: 0 },
    lifetimePoints: { type: Number, default: 0 },
    badges: [{
      name: String,
      earnedAt: { type: Date, default: Date.now }
    }],
    pointsHistory: [{
      points: Number,
      reason: String,
      createdAt: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true
});

export const User = mongoose.model('User', userSchema);
