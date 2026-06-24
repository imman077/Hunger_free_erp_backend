import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Milestone } from './models/Config';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

export const milestonesData = [
  // --- DONOR ACHIEVEMENTS ---
  { name: 'First Spark', desc: 'Make your very first donation', category: 'donors', requirementType: 'donations', threshold: 1, icon: 'Flame', active: true },
  { name: 'Helping Hand', desc: 'Completed 10 total donations', category: 'donors', requirementType: 'donations', threshold: 10, icon: 'Users', active: true },
  { name: 'Kind Soul', desc: 'Completed 50 total donations', category: 'donors', requirementType: 'donations', threshold: 50, icon: 'Heart', active: true },
  { name: 'Generous Heart', desc: 'Completed 100 total donations', category: 'donors', requirementType: 'donations', threshold: 100, icon: 'Target', active: true },
  { name: 'Community Pillar', desc: 'Donate 1,000 times to the ecosystem', category: 'donors', requirementType: 'donations', threshold: 1000, icon: 'Award', active: true },
  { name: 'Impact Starter', desc: 'Earn 1,000 impact points', category: 'donors', requirementType: 'points', threshold: 1000, icon: 'Zap', active: true },
  { name: 'Point Master', desc: 'Earn 10,000 impact points', category: 'donors', requirementType: 'points', threshold: 10000, icon: 'Trophy', active: true },
  { name: 'Global Impact', desc: 'Reach 50,000 total impact points', category: 'donors', requirementType: 'points', threshold: 50000, icon: 'Globe', active: true },
  { name: 'Elite Patron', desc: 'Rank in the top tier of donors', category: 'donors', requirementType: 'points', threshold: 100000, icon: 'Crown', active: true },
  { name: 'Consistency King', desc: '7-day consistent donation streak', category: 'donors', requirementType: 'streaks', threshold: 7, icon: 'Flame', active: true },
  { name: 'Streak Sensation', desc: '30-day consistent donation streak', category: 'donors', requirementType: 'streaks', threshold: 30, icon: 'Target', active: true },
  { name: 'Unstoppable', desc: '100-day consistent donation streak', category: 'donors', requirementType: 'streaks', threshold: 100, icon: 'Zap', active: true },
  { name: 'Local Guardian', desc: 'Support 5 different local NGOs', category: 'donors', requirementType: 'donations', threshold: 5, icon: 'Shield', active: true },
  { name: 'Community Glue', desc: 'Refer 10 new donors', category: 'donors', requirementType: 'donations', threshold: 10, icon: 'Users', active: true },

  // --- NGO ACHIEVEMENTS ---
  { name: 'Rescue Rookie', desc: 'Save 100kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 100, icon: 'Package', active: true },
  { name: 'Zero Waste Pro', desc: 'Save 500kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 500, icon: 'Shield', active: true },
  { name: 'Impact Engine', desc: 'Save 1,000kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 1000, icon: 'Zap', active: true },
  { name: 'Sustainability Star', desc: 'Save 5,000kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 5000, icon: 'Globe', active: true },
  { name: 'Hunger Warrior', desc: 'Save 10,000kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 10000, icon: 'Trophy', active: true },
  { name: 'Ecosystem Giant', desc: 'Save 50,000kg of food from wastage', category: 'ngos', requirementType: 'deliveries', threshold: 50000, icon: 'Crown', active: true },
  { name: 'Credit Starter', desc: 'Earn 5,000 impact points', category: 'ngos', requirementType: 'points', threshold: 5000, icon: 'Star', active: true },
  { name: 'Resource Master', desc: 'Earn 25,000 impact points', category: 'ngos', requirementType: 'points', threshold: 25000, icon: 'Target', active: true },
  { name: 'NGO Elite', desc: 'Earn 100,000 impact points', category: 'ngos', requirementType: 'points', threshold: 100000, icon: 'Gem', active: true },
  { name: 'Rescue Streak', desc: 'Maintain a 7-day food rescue streak', category: 'ngos', requirementType: 'streaks', threshold: 7, icon: 'Flame', active: true },
  { name: 'Reliability Master', desc: 'Maintain a 30-day food rescue streak', category: 'ngos', requirementType: 'streaks', threshold: 30, icon: 'Target', active: true },
  { name: 'Operational Excellence', desc: 'Maintain a 100-day food rescue streak', category: 'ngos', requirementType: 'streaks', threshold: 100, icon: 'Zap', active: true },

  // --- VOLUNTEER ACHIEVEMENTS ---
  { name: 'Swift Start', desc: 'Complete 10 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 10, icon: 'Flame', active: true },
  { name: 'Path Finder', desc: 'Complete 50 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 50, icon: 'Target', active: true },
  { name: 'Food Hero', desc: 'Achieve 100 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 100, icon: 'Shield', active: true },
  { name: 'Street Legend', desc: 'Complete 250 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 250, icon: 'Zap', active: true },
  { name: 'Community Savior', desc: 'Complete 500 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 500, icon: 'Trophy', active: true },
  { name: 'Guardian Angel', desc: 'Complete 1,000 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 1000, icon: 'Heart', active: true },
  { name: 'Hunger Destroyer', desc: 'Complete 5,000 successful deliveries', category: 'volunteers', requirementType: 'deliveries', threshold: 5000, icon: 'Crown', active: true },
  { name: 'Service Spark', desc: 'Earn 2,000 impact points', category: 'volunteers', requirementType: 'points', threshold: 2000, icon: 'Star', active: true },
  { name: 'Elite Guardian', desc: 'Earn 10,000 impact points', category: 'volunteers', requirementType: 'points', threshold: 10000, icon: 'ShieldCheck', active: true },
  { name: 'Reliable Heart', desc: 'Maintain a 14-day delivery streak', category: 'volunteers', requirementType: 'streaks', threshold: 14, icon: 'Heart', active: true },
  { name: 'Commitment Pillar', desc: 'Maintain a 30-day delivery streak', category: 'volunteers', requirementType: 'streaks', threshold: 30, icon: 'Shield', active: true },
  { name: 'The Unstoppable Hero', desc: 'Maintain a 100-day delivery streak', category: 'volunteers', requirementType: 'streaks', threshold: 100, icon: 'Zap', active: true }
];

async function seedMilestones() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully');

    const count = await Milestone.countDocuments();
    if (count > 0) {
      console.log('Milestones already seeded. Skipping.');
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB.');
      return;
    }

    console.log('Seeding milestones...');
    await Milestone.insertMany(milestonesData);
    console.log('Milestones seeded successfully!');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding milestones:', error);
    process.exit(1);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  seedMilestones();
}
