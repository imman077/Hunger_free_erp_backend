import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: String,
  message: { type: String, required: true },
  role: { type: String, default: '' },
  status: { type: String, default: 'Unread' }
}, {
  timestamps: true
});

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
