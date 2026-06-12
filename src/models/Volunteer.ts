import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  zone: { type: String, required: true },
  skills: [String],
  volunteerAreas: [String],
  tasksCompleted: { type: Number, default: 0 },
  rating: { type: Number, default: 0.0 },
  vehicleType: String,
  status: { type: String, default: 'available' },
  verificationStatus: { type: String, default: 'Pending' },
  points: { type: Number, default: 0 },
  lifetimePoints: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
