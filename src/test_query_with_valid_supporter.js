const mongoose = require('mongoose');
const http = require('http');

const MONGODB_URI = 'mongodb://localhost:27017/hunger_free_erp';

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  
  // 1. Update the need supporterIds to use the actual seeded donor ID
  const needId = '6a198a6344c66510f4881395';
  const donorId = '6a198a6344c66510f4881376';
  
  await mongoose.connection.db.collection('needs').updateOne(
    { _id: new mongoose.Types.ObjectId(needId) },
    { $set: { supporterIds: [donorId] } }
  );
  console.log(`Updated need ${needId} supporterIds to [${donorId}]`);
  
  // 2. Query GraphQL
  const query = `
    query GetNeeds($status: String) {
      needs(status: $status) {
        id
        ngoName
        itemName
        supporterIds
        supporters {
          id
          username
          email
          role
        }
        supportersDetails {
          id
          name
          quantity
        }
      }
    }
  `;

  const data = JSON.stringify({ query, variables: { status: "Open" } });

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log('\n--- GraphQL Response ---');
      const parsed = JSON.parse(body);
      const riceNeed = parsed.data.needs.find(n => n.id === needId);
      console.log(JSON.stringify(riceNeed, null, 2));
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });

  req.write(data);
  req.end();

  await mongoose.disconnect();
}

run().catch(console.error);
