const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load models
const Cylinder = require('../src/models/Cylinder');
const Reading = require('../src/models/Reading');
const User = require('../src/models/User');

dotenv.config();

const SEED_FILE = path.resolve(__dirname, '../../ml-engine/data_generator/seed_data.json');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/indhan';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding...');

    // Read seed data
    if (!fs.existsSync(SEED_FILE)) {
      console.warn(`Seed file not found at ${SEED_FILE}. Please ensure the Data Engineer has run the generator.`);
      process.exit(1);
    }
    
    const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));

    // Clear existing
    await Cylinder.deleteMany({});
    await Reading.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data.');

    // Seed User
    const user = new User({
      name: "Demo User",
      email: "demo@indhan.io",
      passwordHash: "mock_hash"
    });
    await user.save();

    // Seed Cylinders
    const cylinderMap = {};
    for (const cyl of seedData.cylinders) {
      const newCyl = new Cylinder({
        user_id: user._id,
        name: cyl.name,
        tare_weight_kg: cyl.tare_weight_kg,
        capacity_kg: cyl.capacity_kg
      });
      await newCyl.save();
      cylinderMap[cyl.id] = newCyl._id;
    }

    // Seed Readings
    const readingsToInsert = seedData.readings.map(r => ({
      cylinder_id: cylinderMap[r.cylinder_id],
      timestamp: new Date(r.timestamp),
      weight_kg: r.weight_kg
    }));
    await Reading.insertMany(readingsToInsert);

    console.log(`Successfully seeded ${seedData.cylinders.length} cylinders and ${seedData.readings.length} readings.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
