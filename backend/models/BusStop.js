const mongoose = require('mongoose');

const busStopSchema = new mongoose.Schema({
  id:       { type: String, required: true, unique: true }, // e.g. "borivali-east-bus"
  name:     { type: String, required: true },               // e.g. "Borivali East Bus Stop"
  lat:      { type: Number, required: true },
  lng:      { type: Number, required: true },
  near:     { type: String, required: true },               // station id, e.g. "borivali"
  side:     { type: String, enum: ['East', 'West', 'North', 'South', ''] },
  buses:    { type: [String], default: [] },                // route numbers e.g. ["268", "388"]
  walkMins: { type: Number, default: 5 },                   // walking time from station
});

// Index to quickly fetch all stops near a station
busStopSchema.index({ near: 1 });

module.exports = mongoose.model('BusStop', busStopSchema);
