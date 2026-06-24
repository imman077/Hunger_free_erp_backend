import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { startRestServer } from './rest/restServer';
import { GamificationTier } from './models/GamificationTier';
import { Milestone } from './models/Config';
import { gamificationTiersData } from './seed_gamification_tiers';
import { milestonesData } from './seed_milestones';

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });

  // Set up Mongoose connection event listeners
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB is connected successfully');
    // Start Express REST server on port 8000
    startRestServer(8000);
  });
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });

    // Auto-seed on startup if collections are empty
    const [tierCount, milestoneCount] = await Promise.all([
      GamificationTier.countDocuments(),
      Milestone.countDocuments(),
    ]);

    if (tierCount === 0) {
      await GamificationTier.insertMany(gamificationTiersData);
      console.log('🌱 Gamification tiers auto-seeded.');
    } else {
      console.log('✅ Gamification tiers already seeded. Skipping auto-seed.');
    }

    if (milestoneCount === 0) {
      await Milestone.insertMany(milestonesData);
      console.log('🌱 Milestones auto-seeded.');
    } else {
      console.log('✅ Milestones already seeded. Skipping auto-seed.');
    }

    const { url } = await startStandaloneServer(server, {
      listen: { port: Number(PORT) },
    });
    console.log(`🚀 GraphQL Server ready at ${url}`);
  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
}

startServer();
// Trigger reload comment
