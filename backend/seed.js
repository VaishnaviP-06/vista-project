require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./db');

const Train    = require('./models/Train');
const Station  = require('./models/Station');
const BusStop  = require('./models/BusStop');

const trains   = require('./data/trains.json');
const stations = require('./data/stations.json');
const busStops = require('./data/busStops.json');

const seed = async () => {
  await connectDB();
  console.log('\n--- VISTA Seed Starting ---\n');

  // ---------- Trains ----------
  await Train.deleteMany({});
  const trainResult = await Train.insertMany(trains, { ordered: false });
  console.log(`✓ Trains:   ${trainResult.length} inserted`);

  // ---------- Stations ----------
  await Station.deleteMany({});
  const stationResult = await Station.insertMany(stations);
  console.log(`✓ Stations: ${stationResult.length} inserted`);

  // ---------- Bus Stops ----------
  await BusStop.deleteMany({});
  const busResult = await BusStop.insertMany(busStops);
  console.log(`✓ Bus Stops: ${busResult.length} inserted`);

  console.log('\n--- Seed Complete ---\n');
  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.connection.close();
  process.exit(1);
});
