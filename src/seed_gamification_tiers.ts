import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GamificationTier } from './models/GamificationTier';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

export const gamificationTiersData = [
  // --- DONOR TIERS ---
  { name: "Beginner", role: "DONOR", range: "0 - 500", bonus: "0%", pointsRequired: 0, perks: "Welcome Pack, Forum Access, Standard Support", color: "#64748b" },
  { name: "Bronze", role: "DONOR", range: "501 - 1,500", bonus: "5%", pointsRequired: 501, perks: "Verified Badge, 5% Multiplier, Raffle Entry", color: "#92400e" },
  { name: "Silver", role: "DONOR", range: "1,501 - 3,500", bonus: "10%", pointsRequired: 1501, perks: "Silver Badge, Priority Pickup, Impact Reports", color: "#475569" },
  { name: "Gold", role: "DONOR", range: "3,501 - 7,500", bonus: "15%", pointsRequired: 3501, perks: "Gold Badge, VIP Event Invites, Direct Support", color: "#b45309" },
  { name: "Platinum", role: "DONOR", range: "7,501 - 15,000", bonus: "20%", pointsRequired: 7501, perks: "Platinum Badge, Exclusive Gear, Impact Manager", color: "#4338ca" },
  { name: "Diamond", role: "DONOR", range: "15,001 - 30,000", bonus: "25%", pointsRequired: 15001, perks: "Diamond Badge, Featured Profile, Milestone Gifts", color: "#0891b2" },
  { name: "Legend", role: "DONOR", range: "30,001+", bonus: "40%", pointsRequired: 30001, perks: "Legend Badge, 10 Trees/mo, Global All-Access", color: "#059669" },
  // --- NGO TIERS ---
  { name: "Starter", role: "NGO", range: "0 - 1,999", bonus: "0%", pointsRequired: 0, perks: "Basic platform access", color: "#6b7280" },
  { name: "Silver", role: "NGO", range: "2,000+", bonus: "10%", pointsRequired: 2000, perks: "Grant eligibility, Priority listing", color: "#c0c0c0" },
  // --- VOLUNTEER TIERS ---
  { name: "Rising", role: "VOLUNTEER", range: "0 - 499", bonus: "0%", pointsRequired: 0, perks: "Task access, Basic rewards", color: "#10b981" },
  { name: "Elite", role: "VOLUNTEER", range: "500+", bonus: "15%", pointsRequired: 500, perks: "Priority tasks, Fuel card eligibility", color: "#f59e0b" },
];

async function seedGamificationTiers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully');

    // Drop existing tiers to refresh with the new role-based schema
    const deleted = await GamificationTier.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing gamification tier(s).`);

    console.log('Seeding gamification tiers with roles...');
    await GamificationTier.insertMany(gamificationTiersData);
    console.log(`Gamification tiers seeded successfully! (${gamificationTiersData.length} tiers)`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  } catch (error) {
    console.error('Error seeding gamification tiers:', error);
    process.exit(1);
  }
}

if (typeof require !== 'undefined' && require.main === module) {
  seedGamificationTiers();
}
