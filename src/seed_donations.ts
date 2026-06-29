import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Donation } from './models/Donation';
import { User } from './models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hunger_free_erp';
const DONOR_ID = '6a1939fe875b850d3dd88b6b'; // Star Hotel ID
const NGO_ID = '6a19bd8080064a1fc2195a11'; // helping_hands ID

const sampleDonations = [
  {
    foodType: 'Cooking Oil',
    category: 'Dry Ration',
    dietaryType: 'Veg',
    preparationType: 'Packaged',
    quantity: '5 Litres',
    donor: DONOR_ID,
    date: 'Jun 23, 2026',
    status: 'PENDING',
    pickupAddress: 'Star Hotel Main Lobby, Block 4, Sector 7, MG Road',
    description: 'Fresh unopened cooking oil canisters for donation.',
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 23, 2026',
        time: '06:00 PM',
        completed: true,
        description: 'Food donation request created. Waiting for NGO acceptance.',
      }
    ]
  },
  {
    foodType: 'Rice Bags',
    category: 'Dry Ration',
    dietaryType: 'Veg',
    preparationType: 'Packaged',
    quantity: '50 kg',
    ngo: NGO_ID,
    donor: DONOR_ID,
    date: 'Jun 24, 2026',
    status: 'ACCEPTED',
    pickupAddress: 'Star Hotel Main Kitchen Loading Dock',
    deliveryAddress: 'Helping Hands Shelter, Sector 2, Lane B',
    description: 'Basmati rice bags (2 bags of 25kg each). stored in a cool place.',
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 24, 2026',
        time: '10:00 AM',
        completed: true,
        description: 'Food donation request created.',
      },
      {
        status: 'Accepted',
        date: 'Jun 24, 2026',
        time: '11:30 AM',
        completed: true,
        description: 'NGO helping_hands accepted the request.',
      }
    ]
  },
  {
    foodType: 'Fresh Tomatoes & Potatoes',
    category: 'Fresh Produce',
    dietaryType: 'Veg',
    preparationType: 'Raw',
    quantity: '15 kg',
    ngo: NGO_ID,
    donor: DONOR_ID,
    date: 'Jun 25, 2026',
    status: 'ASSIGNED',
    pickupAddress: 'Star Hotel Rear Entrance, Gate 2',
    deliveryAddress: 'Helping Hands Shelter, Sector 2, Lane B',
    description: 'Fresh vegetables harvested yesterday, kept in clean crates.',
    volunteer: {
      name: 'John V',
      phone: '+91 98765 43210',
      rating: '4.8',
    },
    volunteerLocation: {
      lat: 12.9716,
      lng: 77.5946
    },
    pickupCoords: {
      lat: 12.9722,
      lng: 77.5950
    },
    deliveryCoords: {
      lat: 12.9698,
      lng: 77.5930
    },
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 25, 2026',
        time: '02:00 PM',
        completed: true,
        description: 'Food donation request created.',
      },
      {
        status: 'Accepted',
        date: 'Jun 25, 2026',
        time: '02:15 PM',
        completed: true,
        description: 'NGO accepted the request.',
      },
      {
        status: 'Assigned',
        date: 'Jun 25, 2026',
        time: '02:30 PM',
        completed: true,
        description: 'Volunteer John V has been assigned for pickup.',
      }
    ]
  },
  {
    foodType: 'Veg Biryani Meals',
    category: 'Cooked Food',
    dietaryType: 'Veg',
    preparationType: 'Restaurant',
    quantity: '30 Meals',
    ngo: NGO_ID,
    donor: DONOR_ID,
    date: 'Jun 26, 2026',
    status: 'PICKED_UP',
    pickupAddress: 'Star Hotel Buffet Area, Ground Floor',
    deliveryAddress: 'Helping Hands Shelter, Sector 2, Lane B',
    description: 'Delicious hot vegetable biryani meals packed in environment-friendly containers.',
    volunteer: {
      name: 'John V',
      phone: '+91 98765 43210',
      rating: '4.8',
    },
    volunteerLocation: {
      lat: 12.9702,
      lng: 77.5938
    },
    pickupCoords: {
      lat: 12.9722,
      lng: 77.5950
    },
    deliveryCoords: {
      lat: 12.9698,
      lng: 77.5930
    },
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 26, 2026',
        time: '12:00 PM',
        completed: true,
        description: 'Food donation request created.',
      },
      {
        status: 'Accepted',
        date: 'Jun 26, 2026',
        time: '12:10 PM',
        completed: true,
        description: 'NGO accepted the request.',
      },
      {
        status: 'Assigned',
        date: 'Jun 26, 2026',
        time: '12:15 PM',
        completed: true,
        description: 'Volunteer John V assigned.',
      },
      {
        status: 'Picked Up',
        date: 'Jun 26, 2026',
        time: '12:35 PM',
        completed: true,
        description: 'Volunteer picked up food. In transit to destination.',
      }
    ]
  },
  {
    foodType: 'Fresh Apples & Oranges',
    category: 'Fresh Produce',
    dietaryType: 'Veg',
    preparationType: 'Raw',
    quantity: '20 kg',
    ngo: NGO_ID,
    donor: DONOR_ID,
    date: 'Jun 20, 2026',
    status: 'DELIVERED',
    pickupAddress: 'Star Hotel Main Entrance Pantry',
    deliveryAddress: 'Helping Hands Shelter, Sector 2, Lane B',
    description: 'Fresh selected fruits box for kids.',
    volunteer: {
      name: 'John V',
      phone: '+91 98765 43210',
      rating: '4.8',
    },
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 20, 2026',
        time: '09:00 AM',
        completed: true,
      },
      {
        status: 'Accepted',
        date: 'Jun 20, 2026',
        time: '09:15 AM',
        completed: true,
      },
      {
        status: 'Assigned',
        date: 'Jun 20, 2026',
        time: '09:30 AM',
        completed: true,
      },
      {
        status: 'Picked Up',
        date: 'Jun 20, 2026',
        time: '09:50 AM',
        completed: true,
      },
      {
        status: 'Delivered',
        date: 'Jun 20, 2026',
        time: '10:15 AM',
        completed: true,
        description: 'Donation successfully delivered to NGO shelter. Thank you!',
      }
    ]
  },
  {
    foodType: 'Fresh Milk Packets',
    category: 'Dry Ration',
    dietaryType: 'Veg',
    preparationType: 'Packaged',
    quantity: '40 Packets',
    donor: DONOR_ID,
    date: 'Jun 21, 2026',
    status: 'CANCELLED',
    pickupAddress: 'Star Hotel Main Pantry Fridge 2',
    description: 'Pasteurized milk packets. Cancelled due to refrigerator issues.',
    timeline: [
      {
        status: 'Pending',
        date: 'Jun 21, 2026',
        time: '08:00 AM',
        completed: true,
      },
      {
        status: 'Cancelled',
        date: 'Jun 21, 2026',
        time: '09:00 AM',
        completed: true,
        description: 'Donation request cancelled by donor. Reason: Storage refrigerator failure.',
      }
    ]
  }
];

async function seed() {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing donations first
    console.log('🧹 Clearing existing donations...');
    await Donation.deleteMany({});
    console.log('✅ Cleared donations');

    // Insert sample donations
    console.log('🌱 Inserting sample donations...');
    const result = await Donation.insertMany(sampleDonations);
    console.log(`✅ Successfully seeded ${result.length} sample donations!`);

    // Let's also update the total stats for user
    console.log('👤 Updating Donor User points history...');
    await User.findByIdAndUpdate(DONOR_ID, {
      $set: {
        'gamification.points': 1250,
        'gamification.lifetimePoints': 2500,
      }
    });
    console.log('✅ Updated Donor points to 1250.');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB Disconnected');
  }
}

seed();
