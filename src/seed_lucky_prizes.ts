import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { LuckySpinPrize } from './models/LuckySpin';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

const newPrizes = [
  // DONOR (8 prizes)
  { role: 'DONOR', label: '500 Bonus Points', prizeType: 'POINTS', value: 500, icon: 'star', probability: 0.30, isActive: true },
  { role: 'DONOR', label: '₹200 Voucher', prizeType: 'VOUCHER', value: 200, icon: 'gift', probability: 0.10, isActive: true },
  { role: 'DONOR', label: '1,000 Points', prizeType: 'POINTS', value: 1000, icon: 'star', probability: 0.20, isActive: true },
  { role: 'DONOR', label: '₹500 Cash', prizeType: 'CASH', value: 500, icon: 'cash', probability: 0.05, isActive: true },
  { role: 'DONOR', label: 'Try Again', prizeType: 'POINTS', value: 0, icon: 'zap', probability: 0.15, isActive: true },
  { role: 'DONOR', label: '200 Points', prizeType: 'POINTS', value: 200, icon: 'star', probability: 0.10, isActive: true },
  { role: 'DONOR', label: '₹100 Voucher', prizeType: 'VOUCHER', value: 100, icon: 'gift', probability: 0.05, isActive: true },
  { role: 'DONOR', label: 'GRAND JACKPOT', prizeType: 'VOUCHER', value: 5000, icon: 'gift', probability: 0.05, isActive: true },

  // NGO (8 prizes)
  { role: 'NGO', label: '₹25,000 Grant', prizeType: 'GRANT', value: 25000, icon: 'gift', probability: 0.05, isActive: true },
  { role: 'NGO', label: '5,000 Points', prizeType: 'POINTS', value: 5000, icon: 'star', probability: 0.25, isActive: true },
  { role: 'NGO', label: '2,000 Points', prizeType: 'POINTS', value: 2000, icon: 'star', probability: 0.20, isActive: true },
  { role: 'NGO', label: '₹10,000 Grant', prizeType: 'GRANT', value: 10000, icon: 'gift', probability: 0.10, isActive: true },
  { role: 'NGO', label: '500 Points', prizeType: 'POINTS', value: 500, icon: 'star', probability: 0.15, isActive: true },
  { role: 'NGO', label: 'Try Again', prizeType: 'POINTS', value: 0, icon: 'zap', probability: 0.10, isActive: true },
  { role: 'NGO', label: '1,000 Points', prizeType: 'POINTS', value: 1000, icon: 'star', probability: 0.10, isActive: true },
  { role: 'NGO', label: 'GRAND JACKPOT', prizeType: 'GRANT', value: 100000, icon: 'gift', probability: 0.05, isActive: true },

  // VOLUNTEER (8 prizes)
  { role: 'VOLUNTEER', label: '₹500 Fuel', prizeType: 'CASH', value: 500, icon: 'zap', probability: 0.20, isActive: true },
  { role: 'VOLUNTEER', label: '1,000 Points', prizeType: 'POINTS', value: 1000, icon: 'star', probability: 0.35, isActive: true },
  { role: 'VOLUNTEER', label: '₹200 Fuel', prizeType: 'CASH', value: 200, icon: 'zap', probability: 0.15, isActive: true },
  { role: 'VOLUNTEER', label: '500 Points', prizeType: 'POINTS', value: 500, icon: 'star', probability: 0.10, isActive: true },
  { role: 'VOLUNTEER', label: '2,000 Points', prizeType: 'POINTS', value: 2000, icon: 'star', probability: 0.05, isActive: true },
  { role: 'VOLUNTEER', label: '₹1,000 Cash', prizeType: 'CASH', value: 1000, icon: 'cash', probability: 0.05, isActive: true },
  { role: 'VOLUNTEER', label: 'Try Again', prizeType: 'POINTS', value: 0, icon: 'zap', probability: 0.05, isActive: true },
  { role: 'VOLUNTEER', label: 'GRAND JACKPOT', prizeType: 'CASH', value: 5000, icon: 'gift', probability: 0.05, isActive: true }
];

async function seedLuckyPrizes() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    const deleted = await LuckySpinPrize.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing lucky spin prizes.`);

    console.log('Seeding new lucky spin prizes...');
    const seeded = await LuckySpinPrize.insertMany(newPrizes);
    console.log(`Successfully seeded ${seeded.length} lucky spin prizes!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (err) {
    console.error('Error seeding lucky prizes:', err);
    process.exit(1);
  }
}

seedLuckyPrizes();
