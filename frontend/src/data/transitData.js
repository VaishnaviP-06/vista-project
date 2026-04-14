// src/data/transitData.js
// Western Line: Virar → Nalasopara → Vasai Road → Naigaon → Bhayandar → Mira Road → Dahisar → Borivali

export const STATIONS = [
  {
    id: 1, name: "Virar", lat: 19.4544, lng: 72.8114,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Turn left → Virar Bus Depot, auto stand (50m)", landmarks: "Bus depot, BEST stand" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Virar East residential area", landmarks: "Shops, residential" },
    ]
  },
  {
    id: 2, name: "Nalasopara", lat: 19.4189, lng: 72.8165,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Straight ahead → Nalasopara market, bus stop (80m)", landmarks: "Market, bus stop" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Nalasopara East, auto stand", landmarks: "Auto stand, residential" },
    ]
  },
  {
    id: 3, name: "Vasai Road", lat: 19.3820, lng: 72.8317,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Straight → Vasai West market, bus stop (100m)", landmarks: "Market, hotel" },
      { gate: "Gate 2", side: "East", direction: "Cross the bridge → Vasai East, auto stand", landmarks: "Auto stand" },
    ]
  },
  {
    id: 4, name: "Naigaon", lat: 19.3510, lng: 72.8441,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Straight → Naigaon market, bus stop (60m)", landmarks: "Market, bus stop" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Naigaon East, auto stand (50m)", landmarks: "Auto stand" },
    ]
  },
  {
    id: 5, name: "Bhayandar", lat: 19.3101, lng: 72.8533,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Turn left → Bhayandar market, BEST bus stop (60m)", landmarks: "Market, BEST bus" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Mira-Bhayandar Road, auto stand (40m)", landmarks: "Auto stand, highway" },
    ]
  },
  {
    id: 6, name: "Mira Road", lat: 19.2812, lng: 72.8692,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Straight → Mira Road market, bus stop (70m)", landmarks: "Maxus Mall, market" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Bhayandar East, auto stand (50m)", landmarks: "Auto stand" },
    ]
  },
  {
    id: 7, name: "Dahisar", lat: 19.2547, lng: 72.8600,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Turn left → Dahisar Check Naka, BEST bus stop (90m)", landmarks: "Check Naka, BEST bus" },
      { gate: "Gate 2", side: "East", direction: "Turn right → Dahisar East, auto stand (60m)", landmarks: "Auto stand, shops" },
    ]
  },
  {
    id: 8, name: "Borivali", lat: 19.2307, lng: 72.8567,
    exits: [
      { gate: "Gate 1", side: "West", direction: "Turn left → BEST bus depot (100m), Poisar Gymkhana (200m), S.V. Road", landmarks: "BEST depot, S.V. Road" },
      { gate: "Gate 2", side: "West", direction: "Turn right → Borivali market, IC Colony (150m)", landmarks: "Market, IC Colony" },
      { gate: "Gate 3", side: "East", direction: "Straight → Sanjay Gandhi National Park entry (400m), auto stand", landmarks: "SGNP, auto stand" },
    ]
  },
];

export const TRAINS = [
  {
    // Fast — halts: Virar, Borivali only. Passes through all 8.
    id: "WR001", name: "Virar Fast Express", type: "Fast",
    stops: [1, 2, 3, 4, 5, 6, 7, 8],
    times: ["05:10","05:40","06:10","06:40","07:10","07:40","08:10","08:40",
            "09:10","09:40","10:10","10:40","11:10","11:40","12:10","12:40",
            "13:10","13:40","14:10","14:40","15:10","15:40","16:10","16:40",
            "17:10","17:40","18:10","18:40","19:10","19:40","20:10","20:40","21:10","21:40","22:10"],
    platform_south: [2, 4], platform_north: 2,
  },
  {
    // Fast — halts: Virar, Bhayandar, Borivali. Passes through all 8.
    id: "WR002", name: "Borivali Shuttle", type: "Fast",
    stops: [1, 2, 3, 4, 5, 6, 7, 8],
    times: ["05:22","05:52","06:22","06:52","07:22","07:52","08:22","08:52",
            "09:22","09:52","10:22","10:52","11:22","11:52","12:22","12:52",
            "13:22","13:52","14:22","14:52","15:22","15:52","16:22","16:52",
            "17:22","17:52","18:22","18:52","19:22","19:52","20:22","20:52","21:22","21:52"],
    platform_south: [2, 4], platform_north: 1,
  },
  {
    // Slow — halts at every station
    id: "WR003", name: "Slow Passenger Local", type: "Slow",
    stops: [1,2,3,4,5,6,7,8],
    times: ["05:05","05:35","06:05","06:35","07:05","07:35","08:05","08:35",
            "09:05","09:35","10:05","10:35","11:05","11:35","12:05","12:35",
            "13:05","13:35","14:05","14:35","15:05","15:35","16:05","16:35",
            "17:05","17:35","18:05","18:35","19:05","19:35","20:05","20:35","21:05","21:35","22:05"],
    platform_south: [2, 4], platform_north: 4,
  },
];

export const BUS_STOPS = [
  { name: "Virar Bus Depot",        lat: 19.4620, lng: 72.8100, near: "Virar",      buses: ["V-1","V-2","V-5"] },
  { name: "Nalasopara Bus Stop",    lat: 19.4180, lng: 72.7960, near: "Nalasopara", buses: ["NL-1","NL-3"] },
  { name: "Vasai Road Bus Stop",    lat: 19.3710, lng: 72.8240, near: "Vasai Road", buses: ["VS-1","VS-2"] },
  { name: "Naigaon Bus Stop",       lat: 19.3970, lng: 72.7940, near: "Naigaon",    buses: ["NG-1","NG-2"] },
  { name: "Bhayandar Station West", lat: 19.3010, lng: 72.8480, near: "Bhayandar",  buses: ["BH-1","BH-4"] },
  { name: "Mira Road Bus Stand",    lat: 19.2800, lng: 72.8670, near: "Mira Road",  buses: ["MR-1","MR-2","MR-7"] },
  { name: "Dahisar Check Naka",     lat: 19.2530, lng: 72.8540, near: "Dahisar",    buses: ["DH-1","DH-3"] },
  { name: "Borivali Station West",  lat: 19.2320, lng: 72.8510, near: "Borivali",   buses: ["290","294","471","492"] },
  { name: "Borivali Station East",  lat: 19.2290, lng: 72.8610, near: "Borivali",   buses: ["340","345","388"] },
];
