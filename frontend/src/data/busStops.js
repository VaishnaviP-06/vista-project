// src/data/busStops.js
//
// ─── HOW TO ADD / EDIT A BUS STOP ──────────────────────────────────────────
//  1. Edit the array below (this file is the frontend source of truth).
//  2. Mirror the same change in server/data/busStops.json (used for MongoDB
//     seeding). Both files must stay in sync — fields and values identical.
//  3. Run `npm run seed` from the server/ folder to push changes to MongoDB.
//
// Fields (must match the BusStop mongoose schema in server/models/BusStop.js):
//   id        {string}   unique slug          e.g. "borivali-east-bus"
//   name      {string}   display name         e.g. "Borivali East Bus Stop"
//   lat/lng   {number}   GPS coordinates
//   near      {string}   station id           e.g. "borivali"  ← must match stations.json id
//   side      {string}   "East"|"West"|"North"|"South"|""
//   buses     {string[]} BEST bus route numbers e.g. ["268", "388", "494"]
//   walkMins  {number}   walking time from station exit (minutes)
// ───────────────────────────────────────────────────────────────────────────

const busStops = [
  // ── Borivali ──────────────────────────────────────────────────────────────
  {
    id: "borivali-east-bus",
    name: "Borivali East Bus Stop",
    lat: 19.2318,
    lng: 72.8601,
    near: "borivali",
    side: "East",
    buses: ["268", "388", "494", "296", "351"],
    walkMins: 3,
  },
  {
    id: "borivali-west-bus",
    name: "Borivali West Bus Stop",
    lat: 19.2296,
    lng: 72.8541,
    near: "borivali",
    side: "West",
    buses: ["228", "271", "394", "255"],
    walkMins: 4,
  },

  // ── Kandivali ─────────────────────────────────────────────────────────────
  {
    id: "kandivali-east-bus",
    name: "Kandivali East Bus Stop",
    lat: 19.2067,
    lng: 72.8523,
    near: "kandivali",
    side: "East",
    buses: ["296", "394", "493"],
    walkMins: 4,
  },
  {
    id: "kandivali-west-bus",
    name: "Kandivali West Bus Stop",
    lat: 19.2038,
    lng: 72.8462,
    near: "kandivali",
    side: "West",
    buses: ["271", "255", "388"],
    walkMins: 5,
  },

  // ── Andheri ───────────────────────────────────────────────────────────────
  {
    id: "andheri-east-bus",
    name: "Andheri East Bus Stop",
    lat: 19.1214,
    lng: 72.8502,
    near: "andheri",
    side: "East",
    buses: ["303", "340", "390", "421"],
    walkMins: 5,
  },
  {
    id: "andheri-west-bus",
    name: "Andheri West Bus Stop",
    lat: 19.1183,
    lng: 72.8433,
    near: "andheri",
    side: "West",
    buses: ["231", "268", "298"],
    walkMins: 4,
  },

  // ── Bandra ────────────────────────────────────────────────────────────────
  {
    id: "bandra-east-bus",
    name: "Bandra East Bus Stop",
    lat: 19.0558,
    lng: 72.8431,
    near: "bandra",
    side: "East",
    buses: ["302", "314", "351"],
    walkMins: 6,
  },

  // ── Mira Road ─────────────────────────────────────────────────────────────
  {
    id: "mira-road-east-bus",
    name: "Mira Road East Bus Stop",
    lat: 19.2829,
    lng: 72.8705,
    near: "mira-road",
    side: "East",
    buses: ["221", "481", "801"],
    walkMins: 4,
  },

  // ── Virar ─────────────────────────────────────────────────────────────────
  {
    id: "virar-bus-stand",
    name: "Virar Bus Stand",
    lat: 19.4667,
    lng: 72.8089,
    near: "virar",
    side: "",
    buses: ["ST-101", "ST-204", "V-12", "V-15"],
    walkMins: 5,
  },
];

export default busStops;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** All stops near a given station id, e.g. getBusStopsNear("borivali") */
export const getBusStopsNear = (stationId) =>
  busStops.filter((stop) => stop.near === stationId);

/** Single stop by its unique id, or null if not found */
export const getBusStopById = (id) =>
  busStops.find((stop) => stop.id === id) ?? null;

/** All stops on a given side — "East" | "West" | "North" | "South" */
export const getBusStopsBySide = (side) =>
  busStops.filter((stop) => stop.side === side);
