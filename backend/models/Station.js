const mongoose = require('mongoose');

const platformSchema = new mongoose.Schema({
  towards_virar: [Number],
  towards_churchgate: [Number],
  notes: String,
}, { _id: false });

const stationSchema = new mongoose.Schema({
  id: String,
  name: String,
  lat: Number,
  lng: Number,
  platforms: platformSchema,
});

module.exports = mongoose.model('Station', stationSchema);