const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  type:        { type: String, enum: ['Fast', 'Slow', 'Limited'], required: true },
  from:        { type: String, required: true },
  to:          { type: String, required: true },
  departure:   { type: String, required: true }, // "HH:MM" format
  arrival:     { type: String, required: true }, // "HH:MM" format
  stops:       { type: [String], default: [] },  // ordered list of station names
});

// Index for the most common query: find trains between two stations at a given time
trainSchema.index({ from: 1, to: 1, departure: 1 });

module.exports = mongoose.model('Train', trainSchema);
