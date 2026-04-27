require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const connectDB = require('./db');
const Train     = require('./models/Train');
const Station   = require('./models/Station');
const BusStop   = require('./models/BusStop');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ── Health check ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ status: 'VISTA API running', version: '2.0.0' });
});

// ── GET /trains ─────────────────────────────────────────────────────────────
// Returns trains. Supports optional filters: ?from=Borivali&to=Churchgate&type=Fast
// Used by: train search in the React frontend
app.get('/trains', async (req, res) => {
  try {
    const filter = {};
    if (req.query.from) filter.from = req.query.from;
    if (req.query.to)   filter.to   = req.query.to;
    if (req.query.type) filter.type = req.query.type;

    const trains = await Train.find(filter).sort({ departure: 1 }).lean();
    res.json(trains);
  } catch (err) {
    console.error('GET /trains error:', err);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

// ── GET /stations ───────────────────────────────────────────────────────────
// Returns all 8 Western Line stations (sorted by name).
// Used by: station picker dropdowns in the React frontend
app.get('/stations', async (_req, res) => {
  try {
    const stations = await Station.find({}).sort({ name: 1 }).lean();
    res.json(stations);
  } catch (err) {
    console.error('GET /stations error:', err);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

// ── GET /stations/:id ───────────────────────────────────────────────────────
// Returns a single station by slug id (e.g. "borivali").
// Used by: station detail / last-mile suggestions in the React frontend
app.get('/stations/:id', async (req, res) => {
  try {
    const station = await Station.findOne({ id: req.params.id }).lean();
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    res.json(station);
  } catch (err) {
    console.error('GET /stations/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch station' });
  }
});

// ── GET /bus-stops ──────────────────────────────────────────────────────────
// Returns bus stops. Supports optional filters: ?near=borivali&side=East
// Used by: last-mile options panel in the React frontend
app.get('/bus-stops', async (req, res) => {
  try {
    const filter = {};
    if (req.query.near) filter.near = req.query.near;
    if (req.query.side) filter.side = req.query.side;

    const stops = await BusStop.find(filter).sort({ near: 1, side: 1 }).lean();
    res.json(stops);
  } catch (err) {
    console.error('GET /bus-stops error:', err);
    res.status(500).json({ error: 'Failed to fetch bus stops' });
  }
});

// ── GET /bus-stops/:id ──────────────────────────────────────────────────────
// Returns a single bus stop by slug id (e.g. "borivali-east-bus").
app.get('/bus-stops/:id', async (req, res) => {
  try {
    const stop = await BusStop.findOne({ id: req.params.id }).lean();
    if (!stop) {
      return res.status(404).json({ error: 'Bus stop not found' });
    }
    res.json(stop);
  } catch (err) {
    console.error('GET /bus-stops/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch bus stop' });
  }
});

// ── Start server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✓ VISTA API running on port ${PORT}`);
});
