import mongoose from 'mongoose';
import { resolvers } from './graphql/resolvers';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';

async function check() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  
  // Call the GraphQL resolver directly
  const needs = await resolvers.Query.needs({}, {});
  if (needs && needs.length > 0) {
    const need = needs[0];
    
    // Find a donor to use
    const donor = await mongoose.model('User').findOne({ role: 'DONOR' });
    if (donor) {
      await resolvers.Mutation.createDonation({}, {
        input: {
          foodType: need.itemName,
          category: need.category,
          dietaryType: 'Veg',
          preparationType: 'Restaurant',
          quantity: '7 Litres',
          ngo: need.ngo.toString(),
          donor: donor._id.toString(),
          date: new Date().toLocaleDateString(),
          pickupAddress: 'Mock Address',
          description: 'Mock Description',
          relatedNeed: need.id.toString()
        }
      });
      console.log('Mock donation created!');
    }
    
    const details = await (resolvers.Need as any).supportersDetails(need);
    console.log('Supporter Details for first Need:', JSON.stringify(details, null, 2));
  }
  
  await mongoose.disconnect();
}

check().catch(console.error);
