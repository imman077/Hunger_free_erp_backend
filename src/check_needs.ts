import mongoose from 'mongoose';
import { User } from './models/User';
import { Need } from './models/Need';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  
  const users = await User.find({});
  console.log('\n--- All Users in DB ---');
  users.forEach(u => {
    console.log(`ID: ${u._id.toString()}, Username: ${u.username}, Role: ${u.role}`);
  });

  const needs = await Need.find({});
  console.log('\n--- All Needs in DB ---');
  needs.forEach(n => {
    console.log(`Need ID: ${n._id.toString()}, ItemName: ${n.itemName}, supporterIds:`, n.supporterIds);
  });

  await mongoose.disconnect();
}

check().catch(console.error);
