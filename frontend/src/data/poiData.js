// src/data/poiData.js
// Comprehensive Points of Interest — Virar to Borivali (Western Railway Corridor)
// Covers: Food, Hospitals, Malls, Temples, Schools, Banks, Hotels, Pharmacies, Parks & more

export const POI_LIST = [

  // ═══════════════════════════════════════════════════════
  // VIRAR
  // ═══════════════════════════════════════════════════════

  // Food & Restaurants
  { name: "McDonald's Virar",            area: "Virar West",        station: "Virar", cat: "Food",      tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Virar",        area: "Virar West",        station: "Virar", cat: "Food",      tags: ["pizza","fast food","dominos"] },
  { name: "KFC Virar",                   area: "Virar West",        station: "Virar", cat: "Food",      tags: ["fast food","chicken","kfc"] },
  { name: "Subway Virar",                area: "Virar West",        station: "Virar", cat: "Food",      tags: ["sandwich","subway","fast food"] },
  { name: "Café Coffee Day Virar",       area: "Virar West",        station: "Virar", cat: "Cafe",      tags: ["coffee","cafe","ccd"] },
  { name: "Hotel Sai Palace Virar",      area: "Virar West",        station: "Virar", cat: "Food",      tags: ["restaurant","hotel","thali"] },
  { name: "Gomantak Dining Hall Virar",  area: "Virar East",        station: "Virar", cat: "Food",      tags: ["seafood","goan","restaurant"] },
  { name: "Kailash Parbat Virar",        area: "Virar West",        station: "Virar", cat: "Food",      tags: ["snacks","chaat","restaurant"] },
  { name: "Cream Stone Ice Cream Virar", area: "Virar West",        station: "Virar", cat: "Food",      tags: ["ice cream","dessert"] },
  { name: "New Lucky Dhaba Virar",       area: "Virar East",        station: "Virar", cat: "Food",      tags: ["punjabi","dhaba","restaurant"] },

  // Hospitals
  { name: "Wockhardt Hospital Virar",    area: "Virar West",        station: "Virar", cat: "Hospital",  tags: ["hospital","emergency","medical","wockhardt"] },
  { name: "Bhakti Vedanta Hospital",     area: "Virar West",        station: "Virar", cat: "Hospital",  tags: ["hospital","medical","emergency"] },
  { name: "Siddhivinayak Hospital Virar",area: "Virar East",        station: "Virar", cat: "Hospital",  tags: ["hospital","medical"] },
  { name: "Virar Civil Hospital",        area: "Virar East",        station: "Virar", cat: "Hospital",  tags: ["hospital","government","medical"] },
  { name: "Apex Hospital Virar",         area: "Virar West",        station: "Virar", cat: "Hospital",  tags: ["hospital","clinic","medical"] },

  // Malls & Shopping
  { name: "Rachna Shopping Centre Virar",area: "Virar West",        station: "Virar", cat: "Mall",      tags: ["mall","shopping","market"] },
  { name: "Royal Plaza Mall Virar",      area: "Virar West",        station: "Virar", cat: "Mall",      tags: ["mall","shopping"] },
  { name: "D-Mart Virar",               area: "Virar East",        station: "Virar", cat: "Shopping",  tags: ["dmart","grocery","supermarket"] },
  { name: "Reliance Fresh Virar",        area: "Virar West",        station: "Virar", cat: "Shopping",  tags: ["grocery","reliance","supermarket"] },

  // Temples & Religious
  { name: "Jivdani Temple Virar",        area: "Virar East",        station: "Virar", cat: "Temple",    tags: ["temple","devi","jivdani"] },
  { name: "Tungareshwar Temple",         area: "Virar East",        station: "Virar", cat: "Temple",    tags: ["temple","shiva","nature"] },
  { name: "St Thomas Church Virar",      area: "Virar West",        station: "Virar", cat: "Church",    tags: ["church","christian"] },

  // Banks & ATMs
  { name: "SBI Bank Virar",              area: "Virar West",        station: "Virar", cat: "Bank",      tags: ["bank","sbi","atm"] },
  { name: "HDFC Bank Virar",             area: "Virar West",        station: "Virar", cat: "Bank",      tags: ["bank","hdfc","atm"] },
  { name: "ICICI Bank Virar",            area: "Virar West",        station: "Virar", cat: "Bank",      tags: ["bank","icici","atm"] },
  { name: "Kotak Mahindra Bank Virar",   area: "Virar West",        station: "Virar", cat: "Bank",      tags: ["bank","kotak","atm"] },

  // Schools & Education
  { name: "St Joseph High School Virar", area: "Virar West",        station: "Virar", cat: "School",    tags: ["school","education","st joseph"] },
  { name: "Sardar Patel College Virar",  area: "Virar East",        station: "Virar", cat: "College",   tags: ["college","education"] },
  { name: "Virar Municipal School",      area: "Virar West",        station: "Virar", cat: "School",    tags: ["school","education"] },

  // Pharmacies
  { name: "Apollo Pharmacy Virar",       area: "Virar West",        station: "Virar", cat: "Pharmacy",  tags: ["pharmacy","medicine","apollo"] },
  { name: "MedPlus Virar",               area: "Virar West",        station: "Virar", cat: "Pharmacy",  tags: ["pharmacy","medicine","medplus"] },

  // Nature & Leisure
  { name: "Chinchoti Waterfalls",        area: "Virar East",        station: "Virar", cat: "Nature",    tags: ["waterfall","trek","nature","chinchoti"] },
  { name: "Virar Beach",                 area: "Virar West",        station: "Virar", cat: "Beach",     tags: ["beach","sea","virar"] },
  { name: "Arnala Beach",                area: "Virar West",        station: "Virar", cat: "Beach",     tags: ["beach","arnala","sea"] },
  { name: "Vasai Fort",                  area: "Vasai West",        station: "Virar", cat: "Heritage",  tags: ["fort","heritage","vasai","history"] },

  // Hotels / Lodging
  { name: "Hotel Avion Virar",           area: "Virar West",        station: "Virar", cat: "Hotel",     tags: ["hotel","lodge","stay"] },
  { name: "Hotel Swaad Virar",           area: "Virar West",        station: "Virar", cat: "Hotel",     tags: ["hotel","stay"] },

  // ═══════════════════════════════════════════════════════
  // NALASOPARA
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Nalasopara",       area: "Nalasopara West",   station: "Nalasopara", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Nalasopara",   area: "Nalasopara West",   station: "Nalasopara", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "KFC Nalasopara",              area: "Nalasopara West",   station: "Nalasopara", cat: "Food",     tags: ["kfc","chicken","fast food"] },
  { name: "Café Coffee Day Nalasopara",  area: "Nalasopara West",   station: "Nalasopara", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Vaibhav Garden Restaurant",   area: "Nalasopara East",   station: "Nalasopara", cat: "Food",     tags: ["restaurant","garden","dining"] },
  { name: "Pav Bhaji Center Nalasopara", area: "Nalasopara West",   station: "Nalasopara", cat: "Food",     tags: ["pav bhaji","street food","snacks"] },
  { name: "Hotel Shivam Nalasopara",     area: "Nalasopara East",   station: "Nalasopara", cat: "Food",     tags: ["restaurant","hotel"] },

  { name: "Shree Sai Hospital Nalasopara",area:"Nalasopara West",   station: "Nalasopara", cat: "Hospital", tags: ["hospital","medical","emergency"] },
  { name: "Sunrise Hospital Nalasopara", area: "Nalasopara East",   station: "Nalasopara", cat: "Hospital", tags: ["hospital","medical","sunrise"] },
  { name: "Nalasopara Civil Hospital",   area: "Nalasopara East",   station: "Nalasopara", cat: "Hospital", tags: ["hospital","government","medical"] },
  { name: "Sai Krupa Hospital Nalasopara",area:"Nalasopara West",   station: "Nalasopara", cat: "Hospital", tags: ["hospital","clinic","medical"] },

  { name: "D-Mart Nalasopara",           area: "Nalasopara West",   station: "Nalasopara", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Star Bazaar Nalasopara",      area: "Nalasopara West",   station: "Nalasopara", cat: "Mall",     tags: ["mall","shopping","star bazaar"] },
  { name: "Reliance Smart Nalasopara",   area: "Nalasopara East",   station: "Nalasopara", cat: "Shopping", tags: ["grocery","reliance","supermarket"] },

  { name: "Ganesh Temple Nalasopara",    area: "Nalasopara West",   station: "Nalasopara", cat: "Temple",   tags: ["temple","ganesh","religious"] },
  { name: "St Michael's Church Nalasopara",area:"Nalasopara West",  station: "Nalasopara", cat: "Church",   tags: ["church","christian"] },

  { name: "HDFC Bank Nalasopara",        area: "Nalasopara West",   station: "Nalasopara", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "SBI Bank Nalasopara",         area: "Nalasopara East",   station: "Nalasopara", cat: "Bank",     tags: ["bank","sbi","atm"] },

  { name: "Apollo Pharmacy Nalasopara",  area: "Nalasopara West",   station: "Nalasopara", cat: "Pharmacy", tags: ["pharmacy","medicine","apollo"] },
  { name: "Wellness Forever Nalasopara", area: "Nalasopara West",   station: "Nalasopara", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },

  { name: "Ryan International School Nalasopara",area:"Nalasopara",  station: "Nalasopara", cat: "School",   tags: ["school","education","ryan"] },

  // ═══════════════════════════════════════════════════════
  // VASAI ROAD
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Vasai",            area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Vasai",        area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Pizza Hut Vasai",             area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["pizza","pizza hut","fast food"] },
  { name: "Café Coffee Day Vasai",       area: "Vasai West",        station: "Vasai Road", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Starbucks Vasai",             area: "Vasai West",        station: "Vasai Road", cat: "Cafe",     tags: ["coffee","starbucks","cafe"] },
  { name: "Hotel Tulsi Vasai",           area: "Vasai East",        station: "Vasai Road", cat: "Food",     tags: ["restaurant","thali","hotel"] },
  { name: "Mango Lassi Vasai",           area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["lassi","juice","drinks"] },
  { name: "Goan Fish Market Vasai",      area: "Vasai East",        station: "Vasai Road", cat: "Food",     tags: ["seafood","fish","goan"] },
  { name: "Hotel Broadway Vasai",        area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["restaurant","hotel","dining"] },
  { name: "Madras Cafe Vasai",           area: "Vasai West",        station: "Vasai Road", cat: "Food",     tags: ["south indian","idli","dosa","cafe"] },

  { name: "Bhaktivedanta Hospital Vasai",area: "Vasai Road",        station: "Vasai Road", cat: "Hospital", tags: ["hospital","medical","emergency"] },
  { name: "Vasai Civil Hospital",        area: "Vasai East",        station: "Vasai Road", cat: "Hospital", tags: ["hospital","government","medical"] },
  { name: "Sparsh Hospital Vasai",       area: "Vasai West",        station: "Vasai Road", cat: "Hospital", tags: ["hospital","medical","sparsh"] },
  { name: "Surya Hospital Vasai",        area: "Vasai West",        station: "Vasai Road", cat: "Hospital", tags: ["hospital","surya","medical"] },
  { name: "Lifeline Hospital Vasai",     area: "Vasai Road",        station: "Vasai Road", cat: "Hospital", tags: ["hospital","lifeline","medical"] },

  { name: "Maxus Mall Vasai",            area: "Vasai West",        station: "Vasai Road", cat: "Mall",     tags: ["mall","maxus","shopping","cinema"] },
  { name: "D-Mart Vasai",               area: "Vasai West",        station: "Vasai Road", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Big Bazaar Vasai",            area: "Vasai West",        station: "Vasai Road", cat: "Mall",     tags: ["mall","big bazaar","shopping"] },

  { name: "Vasai Fort",                  area: "Vasai West",        station: "Vasai Road", cat: "Heritage", tags: ["fort","heritage","history","vasai"] },
  { name: "St Gonsalo Garcia Cathedral", area: "Vasai West",        station: "Vasai Road", cat: "Church",   tags: ["church","cathedral","christian","vasai"] },
  { name: "Vajreshwari Temple",          area: "Vasai East",        station: "Vasai Road", cat: "Temple",   tags: ["temple","devi","religious"] },

  { name: "SBI Bank Vasai",              area: "Vasai West",        station: "Vasai Road", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "HDFC Bank Vasai",             area: "Vasai West",        station: "Vasai Road", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "Bank of Baroda Vasai",        area: "Vasai East",        station: "Vasai Road", cat: "Bank",     tags: ["bank","bob","atm"] },

  { name: "Apollo Pharmacy Vasai",       area: "Vasai West",        station: "Vasai Road", cat: "Pharmacy", tags: ["pharmacy","medicine","apollo"] },
  { name: "MedPlus Vasai",              area: "Vasai West",        station: "Vasai Road", cat: "Pharmacy", tags: ["pharmacy","medplus","medicine"] },

  { name: "Holy Cross School Vasai",     area: "Vasai West",        station: "Vasai Road", cat: "School",   tags: ["school","education","holy cross"] },
  { name: "Vasai Virar Municipal College",area:"Vasai East",        station: "Vasai Road", cat: "College",  tags: ["college","education","municipal"] },

  // ═══════════════════════════════════════════════════════
  // NAIGAON
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Naigaon",          area: "Naigaon West",      station: "Naigaon", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Naigaon",      area: "Naigaon West",      station: "Naigaon", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Burger King Naigaon",         area: "Naigaon West",      station: "Naigaon", cat: "Food",     tags: ["burger king","burger","fast food"] },
  { name: "Café Coffee Day Naigaon",     area: "Naigaon West",      station: "Naigaon", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Chai Point Naigaon",          area: "Naigaon West",      station: "Naigaon", cat: "Cafe",     tags: ["chai","tea","cafe"] },
  { name: "Hotel Shreenath Naigaon",     area: "Naigaon East",      station: "Naigaon", cat: "Food",     tags: ["restaurant","hotel","thali"] },
  { name: "Udupi Delights Naigaon",      area: "Naigaon West",      station: "Naigaon", cat: "Food",     tags: ["south indian","udupi","idli","dosa"] },
  { name: "Pav Bhaji Stall Naigaon",     area: "Naigaon Station",   station: "Naigaon", cat: "Food",     tags: ["pav bhaji","street food","snacks"] },
  { name: "Swad Restaurant Naigaon",     area: "Naigaon West",      station: "Naigaon", cat: "Food",     tags: ["restaurant","veg","dining"] },
  { name: "Sai Bhoj Naigaon",            area: "Naigaon East",      station: "Naigaon", cat: "Food",     tags: ["thali","restaurant","veg"] },

  { name: "Naigaon General Hospital",    area: "Naigaon East",      station: "Naigaon", cat: "Hospital", tags: ["hospital","government","medical","emergency"] },
  { name: "Samarth Hospital Naigaon",    area: "Naigaon West",      station: "Naigaon", cat: "Hospital", tags: ["hospital","medical","samarth"] },
  { name: "Vedant Hospital Naigaon",     area: "Naigaon West",      station: "Naigaon", cat: "Hospital", tags: ["hospital","medical","vedant"] },
  { name: "Criticare Hospital Naigaon",  area: "Naigaon West",      station: "Naigaon", cat: "Hospital", tags: ["hospital","critical","medical"] },

  { name: "D-Mart Naigaon",             area: "Naigaon West",      station: "Naigaon", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Reliance Digital Naigaon",    area: "Naigaon West",      station: "Naigaon", cat: "Shopping", tags: ["electronics","reliance","digital"] },
  { name: "Big Bazaar Naigaon",          area: "Naigaon West",      station: "Naigaon", cat: "Mall",     tags: ["mall","big bazaar","shopping"] },

  { name: "Sai Baba Mandir Naigaon",     area: "Naigaon East",      station: "Naigaon", cat: "Temple",   tags: ["temple","sai baba","religious"] },
  { name: "Hanuman Temple Naigaon",      area: "Naigaon West",      station: "Naigaon", cat: "Temple",   tags: ["temple","hanuman","religious"] },
  { name: "Church of Nativity Naigaon",  area: "Naigaon West",      station: "Naigaon", cat: "Church",   tags: ["church","christian"] },

  { name: "HDFC Bank Naigaon",           area: "Naigaon West",      station: "Naigaon", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "SBI Bank Naigaon",            area: "Naigaon East",      station: "Naigaon", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "Axis Bank Naigaon",           area: "Naigaon West",      station: "Naigaon", cat: "Bank",     tags: ["bank","axis","atm"] },

  { name: "Apollo Pharmacy Naigaon",     area: "Naigaon West",      station: "Naigaon", cat: "Pharmacy", tags: ["pharmacy","medicine","apollo"] },
  { name: "Wellness Forever Naigaon",    area: "Naigaon West",      station: "Naigaon", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },

  { name: "St Anthony's School Naigaon", area: "Naigaon West",      station: "Naigaon", cat: "School",   tags: ["school","education","st anthony"] },
  { name: "Holy Family School Naigaon",  area: "Naigaon East",      station: "Naigaon", cat: "School",   tags: ["school","education","holy family"] },

  { name: "Suruchi Beach Naigaon",       area: "Naigaon West",      station: "Naigaon", cat: "Beach",    tags: ["beach","sea","suruchi"] },
  { name: "Naigaon Beach",               area: "Naigaon West",      station: "Naigaon", cat: "Beach",    tags: ["beach","sea","naigaon"] },

  // ═══════════════════════════════════════════════════════
  // BHAYANDAR
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Bhayandar",        area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Bhayandar",    area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Pizza Hut Bhayandar",         area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["pizza","pizza hut","fast food"] },
  { name: "KFC Bhayandar",               area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["kfc","chicken","fast food"] },
  { name: "Subway Bhayandar",            area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["sandwich","subway","fast food"] },
  { name: "Starbucks Bhayandar",         area: "Bhayandar West",    station: "Bhayandar", cat: "Cafe",     tags: ["starbucks","coffee","cafe"] },
  { name: "Café Coffee Day Bhayandar",   area: "Bhayandar West",    station: "Bhayandar", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "The Barista Bhayandar",       area: "Bhayandar West",    station: "Bhayandar", cat: "Cafe",     tags: ["barista","coffee","cafe"] },
  { name: "Hotel Krishana Palace",       area: "Bhayandar East",    station: "Bhayandar", cat: "Food",     tags: ["restaurant","hotel","thali","punjabi"] },
  { name: "Dosa Plaza Bhayandar",        area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["south indian","dosa","restaurant"] },
  { name: "Naturals Ice Cream Bhayandar",area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["ice cream","naturals","dessert"] },
  { name: "Barbeque Nation Bhayandar",   area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["bbq","grill","restaurant","barbeque"] },
  { name: "Paradise Biryani Bhayandar",  area: "Bhayandar East",    station: "Bhayandar", cat: "Food",     tags: ["biryani","restaurant","paradise"] },
  { name: "Madras Cafe Bhayandar",       area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["south indian","idli","cafe"] },
  { name: "Haldirams Bhayandar",         area: "Bhayandar West",    station: "Bhayandar", cat: "Food",     tags: ["haldirams","snacks","sweets"] },

  { name: "Metro Hospital Bhayandar",    area: "Bhayandar West",    station: "Bhayandar", cat: "Hospital", tags: ["hospital","medical","metro","emergency"] },
  { name: "Criticare Hospital Bhayandar",area: "Bhayandar West",    station: "Bhayandar", cat: "Hospital", tags: ["hospital","criticare","medical"] },
  { name: "Shree Siddhivinayak Hospital",area: "Bhayandar East",    station: "Bhayandar", cat: "Hospital", tags: ["hospital","medical","siddhivinayak"] },
  { name: "Harmony Hospital Bhayandar", area: "Bhayandar West",    station: "Bhayandar", cat: "Hospital", tags: ["hospital","harmony","medical"] },
  { name: "Bhayandar Municipal Hospital",area: "Bhayandar East",    station: "Bhayandar", cat: "Hospital", tags: ["hospital","government","medical"] },

  { name: "Thakur Mall Bhayandar",       area: "Bhayandar West",    station: "Bhayandar", cat: "Mall",     tags: ["mall","thakur","shopping","cinema"] },
  { name: "Goldspot Mall Bhayandar",     area: "Bhayandar West",    station: "Bhayandar", cat: "Mall",     tags: ["mall","goldspot","shopping"] },
  { name: "D-Mart Bhayandar",           area: "Bhayandar West",    station: "Bhayandar", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Reliance Smart Bhayandar",    area: "Bhayandar East",    station: "Bhayandar", cat: "Shopping", tags: ["grocery","reliance","supermarket"] },
  { name: "Star Bazaar Bhayandar",       area: "Bhayandar West",    station: "Bhayandar", cat: "Mall",     tags: ["mall","star bazaar","shopping"] },

  { name: "Shree Ram Temple Bhayandar",  area: "Bhayandar East",    station: "Bhayandar", cat: "Temple",   tags: ["temple","ram","religious"] },
  { name: "Shitla Mata Mandir",          area: "Bhayandar West",    station: "Bhayandar", cat: "Temple",   tags: ["temple","devi","shitla"] },
  { name: "Bhayandar Church",            area: "Bhayandar West",    station: "Bhayandar", cat: "Church",   tags: ["church","christian"] },
  { name: "Jain Temple Bhayandar",       area: "Bhayandar West",    station: "Bhayandar", cat: "Temple",   tags: ["temple","jain","religious"] },

  { name: "HDFC Bank Bhayandar",         area: "Bhayandar West",    station: "Bhayandar", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "ICICI Bank Bhayandar",        area: "Bhayandar West",    station: "Bhayandar", cat: "Bank",     tags: ["bank","icici","atm"] },
  { name: "SBI Bank Bhayandar",          area: "Bhayandar East",    station: "Bhayandar", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "Axis Bank Bhayandar",         area: "Bhayandar West",    station: "Bhayandar", cat: "Bank",     tags: ["bank","axis","atm"] },

  { name: "Apollo Pharmacy Bhayandar",   area: "Bhayandar West",    station: "Bhayandar", cat: "Pharmacy", tags: ["pharmacy","apollo","medicine"] },
  { name: "MedPlus Bhayandar",          area: "Bhayandar West",    station: "Bhayandar", cat: "Pharmacy", tags: ["pharmacy","medplus","medicine"] },
  { name: "Wellness Forever Bhayandar", area: "Bhayandar West",    station: "Bhayandar", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },

  { name: "Model English School Bhayandar",area:"Bhayandar West",   station: "Bhayandar", cat: "School",   tags: ["school","education"] },
  { name: "St Joseph School Bhayandar", area: "Bhayandar West",    station: "Bhayandar", cat: "School",   tags: ["school","education","st joseph"] },

  { name: "Kashimira Gym",               area: "Bhayandar East",    station: "Bhayandar", cat: "Gym",      tags: ["gym","fitness","workout"] },
  { name: "Gold's Gym Bhayandar",        area: "Bhayandar West",    station: "Bhayandar", cat: "Gym",      tags: ["gym","golds gym","fitness"] },

  // ═══════════════════════════════════════════════════════
  // MIRA ROAD
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Mira Road",    area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Pizza Hut Mira Road",         area: "Mira Road West",    station: "Mira Road", cat: "Food",     tags: ["pizza","pizza hut","fast food"] },
  { name: "KFC Mira Road",               area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["kfc","chicken","fast food"] },
  { name: "Burger King Mira Road",       area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["burger king","burger","fast food"] },
  { name: "Starbucks Mira Road",         area: "Mira Road East",    station: "Mira Road", cat: "Cafe",     tags: ["starbucks","coffee","cafe"] },
  { name: "Café Coffee Day Mira Road",   area: "Mira Road East",    station: "Mira Road", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Third Wave Coffee Mira Road", area: "Mira Road East",    station: "Mira Road", cat: "Cafe",     tags: ["third wave","coffee","cafe"] },
  { name: "Barbeque Nation Mira Road",   area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["bbq","grill","restaurant","barbeque"] },
  { name: "Hakkasan Mira Road",          area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["chinese","restaurant","fine dining"] },
  { name: "Paradise Biryani Mira Road",  area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["biryani","paradise","restaurant"] },
  { name: "Subway Mira Road",            area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["subway","sandwich","fast food"] },
  { name: "Naturals Ice Cream Mira Road",area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["ice cream","naturals","dessert"] },
  { name: "Haldirams Mira Road",         area: "Mira Road East",    station: "Mira Road", cat: "Food",     tags: ["haldirams","snacks","sweets"] },
  { name: "The Waffle Company Mira Road",area: "Mira Road East",    station: "Mira Road", cat: "Cafe",     tags: ["waffle","dessert","cafe"] },
  { name: "Chaayos Mira Road",           area: "Mira Road East",    station: "Mira Road", cat: "Cafe",     tags: ["chaayos","chai","tea","cafe"] },
  { name: "Amul Ice Cream Parlour Mira Road",area:"Mira Road East", station: "Mira Road", cat: "Food",     tags: ["amul","ice cream","parlour"] },

  { name: "Wockhardt Hospital Mira Road",area: "Mira Road East",    station: "Mira Road", cat: "Hospital", tags: ["hospital","wockhardt","medical","emergency"] },
  { name: "Bhaktivedanta Hospital Mira Rd",area:"Mira Road East",   station: "Mira Road", cat: "Hospital", tags: ["hospital","bhaktivedanta","medical"] },
  { name: "Criticare Hospital Mira Road",area: "Mira Road East",    station: "Mira Road", cat: "Hospital", tags: ["hospital","criticare","medical"] },
  { name: "Niramaya Hospital Mira Road", area: "Mira Road West",    station: "Mira Road", cat: "Hospital", tags: ["hospital","niramaya","medical"] },
  { name: "Shree Sai Hospital Mira Road",area: "Mira Road East",    station: "Mira Road", cat: "Hospital", tags: ["hospital","sai","medical"] },
  { name: "Jupiter Hospital Mira Road",  area: "Mira Road East",    station: "Mira Road", cat: "Hospital", tags: ["hospital","jupiter","medical","emergency"] },
  { name: "Cloud Nine Hospital Mira Road",area:"Mira Road East",    station: "Mira Road", cat: "Hospital", tags: ["hospital","maternity","cloud nine","medical"] },

  { name: "Maxus Mall Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Mall",     tags: ["maxus","mall","shopping","cinema"] },
  { name: "D-Mart Mira Road",           area: "Mira Road East",    station: "Mira Road", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Big Bazaar Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Mall",     tags: ["mall","big bazaar","shopping"] },
  { name: "Star Bazaar Mira Road",       area: "Mira Road East",    station: "Mira Road", cat: "Mall",     tags: ["mall","star bazaar","shopping"] },
  { name: "Reliance Digital Mira Road",  area: "Mira Road East",    station: "Mira Road", cat: "Shopping", tags: ["electronics","reliance","digital"] },
  { name: "Croma Electronics Mira Road", area: "Mira Road East",    station: "Mira Road", cat: "Shopping", tags: ["electronics","croma","gadgets"] },

  { name: "Siddhi Vinayak Temple Mira Road",area:"Mira Road East",  station: "Mira Road", cat: "Temple",   tags: ["temple","ganesh","siddhi vinayak"] },
  { name: "Hanuman Mandir Mira Road",    area: "Mira Road East",    station: "Mira Road", cat: "Temple",   tags: ["temple","hanuman","religious"] },
  { name: "Swaminarayan Temple Mira Rd", area: "Mira Road East",    station: "Mira Road", cat: "Temple",   tags: ["temple","swaminarayan","religious"] },
  { name: "ISKCON Mira Road",            area: "Mira Road East",    station: "Mira Road", cat: "Temple",   tags: ["temple","iskcon","hare krishna","religious"] },

  { name: "HDFC Bank Mira Road",         area: "Mira Road East",    station: "Mira Road", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "ICICI Bank Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Bank",     tags: ["bank","icici","atm"] },
  { name: "SBI Bank Mira Road",          area: "Mira Road East",    station: "Mira Road", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "Axis Bank Mira Road",         area: "Mira Road East",    station: "Mira Road", cat: "Bank",     tags: ["bank","axis","atm"] },
  { name: "Kotak Bank Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Bank",     tags: ["bank","kotak","atm"] },

  { name: "Apollo Pharmacy Mira Road",   area: "Mira Road East",    station: "Mira Road", cat: "Pharmacy", tags: ["pharmacy","apollo","medicine"] },
  { name: "MedPlus Mira Road",          area: "Mira Road East",    station: "Mira Road", cat: "Pharmacy", tags: ["pharmacy","medplus","medicine"] },
  { name: "Wellness Forever Mira Road", area: "Mira Road East",    station: "Mira Road", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },
  { name: "Netmeds Mira Road",           area: "Mira Road East",    station: "Mira Road", cat: "Pharmacy", tags: ["pharmacy","netmeds","medicine"] },

  { name: "Ryan International School Mira Road",area:"Mira Road East",station:"Mira Road", cat: "School",  tags: ["school","ryan","education"] },
  { name: "St Joseph School Mira Road",  area: "Mira Road East",    station: "Mira Road", cat: "School",   tags: ["school","st joseph","education"] },
  { name: "Thakur College Mira Road",    area: "Mira Road East",    station: "Mira Road", cat: "College",  tags: ["college","thakur","education"] },
  { name: "Patkar College Mira Road",    area: "Mira Road East",    station: "Mira Road", cat: "College",  tags: ["college","patkar","education"] },

  { name: "Anand Nagar Park Mira Road",  area: "Mira Road East",    station: "Mira Road", cat: "Park",     tags: ["park","garden","nature"] },
  { name: "Gold's Gym Mira Road",        area: "Mira Road East",    station: "Mira Road", cat: "Gym",      tags: ["gym","golds gym","fitness"] },
  { name: "Snap Fitness Mira Road",      area: "Mira Road East",    station: "Mira Road", cat: "Gym",      tags: ["gym","snap fitness","fitness"] },

  { name: "Hotel Rajhans Mira Road",     area: "Mira Road East",    station: "Mira Road", cat: "Hotel",    tags: ["hotel","lodge","stay"] },
  { name: "Hotel Laxmi Mira Road",       area: "Mira Road East",    station: "Mira Road", cat: "Hotel",    tags: ["hotel","lodge","stay"] },

  // ═══════════════════════════════════════════════════════
  // DAHISAR
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Dahisar",          area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Dahisar",      area: "Dahisar West",      station: "Dahisar", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Pizza Hut Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["pizza","pizza hut","fast food"] },
  { name: "KFC Dahisar",                 area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["kfc","chicken","fast food"] },
  { name: "Burger King Dahisar",         area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["burger king","burger","fast food"] },
  { name: "Starbucks Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Cafe",     tags: ["starbucks","coffee","cafe"] },
  { name: "Café Coffee Day Dahisar",     area: "Dahisar West",      station: "Dahisar", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Chaayos Dahisar",             area: "Dahisar East",      station: "Dahisar", cat: "Cafe",     tags: ["chaayos","chai","tea","cafe"] },
  { name: "Barbeque Nation Dahisar",     area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["bbq","grill","barbeque","restaurant"] },
  { name: "Sarvana Bhavan Dahisar",      area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["south indian","sarvana","restaurant"] },
  { name: "Naturals Ice Cream Dahisar",  area: "Dahisar West",      station: "Dahisar", cat: "Food",     tags: ["ice cream","naturals","dessert"] },
  { name: "Subway Dahisar",              area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["subway","sandwich","fast food"] },
  { name: "Haldirams Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["haldirams","snacks","sweets"] },
  { name: "Chinese Wok Dahisar",         area: "Dahisar East",      station: "Dahisar", cat: "Food",     tags: ["chinese","wok","restaurant"] },
  { name: "Aromas of China Dahisar",     area: "Dahisar West",      station: "Dahisar", cat: "Food",     tags: ["chinese","aromas","restaurant"] },

  { name: "Shatabdi Hospital Dahisar",   area: "Dahisar East",      station: "Dahisar", cat: "Hospital", tags: ["hospital","shatabdi","medical","emergency"] },
  { name: "Bharat Hospital Dahisar",     area: "Dahisar West",      station: "Dahisar", cat: "Hospital", tags: ["hospital","bharat","medical"] },
  { name: "Dahisar Municipal Hospital",  area: "Dahisar East",      station: "Dahisar", cat: "Hospital", tags: ["hospital","government","municipal","medical"] },
  { name: "Criticare Hospital Dahisar",  area: "Dahisar East",      station: "Dahisar", cat: "Hospital", tags: ["hospital","criticare","medical"] },
  { name: "Apex Hospital Dahisar",       area: "Dahisar West",      station: "Dahisar", cat: "Hospital", tags: ["hospital","apex","medical"] },

  { name: "Hypercity Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Mall",     tags: ["mall","hypercity","shopping","cinema"] },
  { name: "D-Mart Dahisar",             area: "Dahisar East",      station: "Dahisar", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Big Bazaar Dahisar",          area: "Dahisar East",      station: "Dahisar", cat: "Mall",     tags: ["mall","big bazaar","shopping"] },
  { name: "Reliance Smart Dahisar",      area: "Dahisar West",      station: "Dahisar", cat: "Shopping", tags: ["grocery","reliance","supermarket"] },

  { name: "Sanjay Gandhi National Park", area: "Dahisar East",      station: "Dahisar", cat: "Nature",   tags: ["park","national park","nature","trek","sgnp"] },
  { name: "Dahisar River Waterfall",     area: "Dahisar East",      station: "Dahisar", cat: "Nature",   tags: ["waterfall","river","nature","trek"] },
  { name: "Charkop Market Dahisar",      area: "Dahisar West",      station: "Dahisar", cat: "Shopping", tags: ["market","charkop","shopping","local"] },

  { name: "Durgamata Mandir Dahisar",    area: "Dahisar West",      station: "Dahisar", cat: "Temple",   tags: ["temple","durga","devi","religious"] },
  { name: "Sai Baba Temple Dahisar",     area: "Dahisar East",      station: "Dahisar", cat: "Temple",   tags: ["temple","sai baba","religious"] },
  { name: "St John Baptist Church",      area: "Dahisar West",      station: "Dahisar", cat: "Church",   tags: ["church","christian","st john"] },

  { name: "HDFC Bank Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "ICICI Bank Dahisar",          area: "Dahisar East",      station: "Dahisar", cat: "Bank",     tags: ["bank","icici","atm"] },
  { name: "SBI Bank Dahisar",            area: "Dahisar West",      station: "Dahisar", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "Axis Bank Dahisar",           area: "Dahisar East",      station: "Dahisar", cat: "Bank",     tags: ["bank","axis","atm"] },

  { name: "Apollo Pharmacy Dahisar",     area: "Dahisar East",      station: "Dahisar", cat: "Pharmacy", tags: ["pharmacy","apollo","medicine"] },
  { name: "MedPlus Dahisar",            area: "Dahisar East",      station: "Dahisar", cat: "Pharmacy", tags: ["pharmacy","medplus","medicine"] },
  { name: "Wellness Forever Dahisar",   area: "Dahisar West",      station: "Dahisar", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },

  { name: "DAV School Dahisar",          area: "Dahisar East",      station: "Dahisar", cat: "School",   tags: ["school","dav","education"] },
  { name: "Gurukul School Dahisar",      area: "Dahisar West",      station: "Dahisar", cat: "School",   tags: ["school","gurukul","education"] },
  { name: "Mandvi School Dahisar",       area: "Dahisar West",      station: "Dahisar", cat: "School",   tags: ["school","education","mandvi"] },

  { name: "Gold's Gym Dahisar",          area: "Dahisar East",      station: "Dahisar", cat: "Gym",      tags: ["gym","golds","fitness"] },
  { name: "Fitness First Dahisar",       area: "Dahisar East",      station: "Dahisar", cat: "Gym",      tags: ["gym","fitness first","fitness"] },

  // ═══════════════════════════════════════════════════════
  // BORIVALI
  // ═══════════════════════════════════════════════════════

  { name: "McDonald's Borivali West",    area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "McDonald's Borivali East",    area: "Borivali East",     station: "Borivali", cat: "Food",     tags: ["fast food","burger","mcdonald"] },
  { name: "Domino's Pizza Borivali",     area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["pizza","dominos","fast food"] },
  { name: "Pizza Hut Borivali",          area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["pizza","pizza hut","fast food"] },
  { name: "KFC Borivali",                area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["kfc","chicken","fast food"] },
  { name: "Burger King Borivali",        area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["burger king","burger","fast food"] },
  { name: "Subway Borivali",             area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["subway","sandwich","fast food"] },
  { name: "Starbucks Borivali",          area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["starbucks","coffee","cafe"] },
  { name: "Café Coffee Day Borivali",    area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["coffee","cafe","ccd"] },
  { name: "Third Wave Coffee Borivali",  area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["third wave","coffee","cafe"] },
  { name: "Blue Tokai Coffee Borivali",  area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["blue tokai","coffee","cafe"] },
  { name: "Chaayos Borivali",            area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["chaayos","chai","tea","cafe"] },
  { name: "The Barista Borivali",        area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["barista","coffee","cafe"] },
  { name: "Barbeque Nation Borivali",    area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["bbq","grill","barbeque","restaurant"] },
  { name: "Sarvana Bhavan Borivali",     area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["south indian","sarvana","restaurant","udupi"] },
  { name: "Copper Chimney Borivali",     area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["mughlai","restaurant","copper chimney"] },
  { name: "Bade Miyan Borivali",         area: "Borivali East",     station: "Borivali", cat: "Food",     tags: ["kebab","restaurant","bade miyan"] },
  { name: "Naturals Ice Cream Borivali", area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["ice cream","naturals","dessert"] },
  { name: "Haldirams Borivali",          area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["haldirams","snacks","sweets","restaurant"] },
  { name: "Paradise Biryani Borivali",   area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["biryani","paradise","restaurant"] },
  { name: "Aromas of China Borivali",    area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["chinese","aromas","restaurant"] },
  { name: "Social Borivali",             area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["social","cafe","bar","restaurant","chill"] },
  { name: "The Humming Tree Borivali",   area: "Borivali West",     station: "Borivali", cat: "Cafe",     tags: ["cafe","chill","food","humming tree"] },
  { name: "Kailash Parbat Borivali",     area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["snacks","chaat","restaurant","kailash parbat"] },
  { name: "Cream Stone Borivali",        area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["ice cream","cream stone","dessert"] },
  { name: "Wan Thai Borivali",           area: "Borivali West",     station: "Borivali", cat: "Food",     tags: ["thai","restaurant","asian"] },

  { name: "Bhagwati Hospital Borivali",  area: "Borivali West",     station: "Borivali", cat: "Hospital", tags: ["hospital","bhagwati","medical","emergency"] },
  { name: "Wockhardt Hospital Borivali", area: "Borivali West",     station: "Borivali", cat: "Hospital", tags: ["hospital","wockhardt","medical","emergency"] },
  { name: "Shatabdi Hospital Borivali",  area: "Borivali East",     station: "Borivali", cat: "Hospital", tags: ["hospital","shatabdi","medical"] },
  { name: "Apex Hospital Borivali",      area: "Borivali West",     station: "Borivali", cat: "Hospital", tags: ["hospital","apex","medical"] },
  { name: "Fortis Hiranandani Hospital", area: "Borivali East",     station: "Borivali", cat: "Hospital", tags: ["hospital","fortis","hiranandani","medical","emergency"] },
  { name: "Satyam Hospital Borivali",    area: "Borivali West",     station: "Borivali", cat: "Hospital", tags: ["hospital","satyam","medical"] },
  { name: "Criticare Hospital Borivali", area: "Borivali East",     station: "Borivali", cat: "Hospital", tags: ["hospital","criticare","medical"] },
  { name: "Cloud Nine Hospital Borivali",area: "Borivali West",     station: "Borivali", cat: "Hospital", tags: ["hospital","maternity","cloud nine","medical"] },
  { name: "Borivali Municipal Hospital", area: "Borivali East",     station: "Borivali", cat: "Hospital", tags: ["hospital","government","municipal","medical"] },

  { name: "Oberoi Mall Borivali",        area: "Borivali East",     station: "Borivali", cat: "Mall",     tags: ["mall","oberoi","shopping","cinema","multiplex"] },
  { name: "Infiniti Mall Borivali",      area: "Borivali West",     station: "Borivali", cat: "Mall",     tags: ["mall","infiniti","shopping","cinema"] },
  { name: "D-Mart Borivali",            area: "Borivali West",     station: "Borivali", cat: "Shopping", tags: ["dmart","grocery","supermarket"] },
  { name: "Big Bazaar Borivali",         area: "Borivali West",     station: "Borivali", cat: "Mall",     tags: ["mall","big bazaar","shopping"] },
  { name: "Reliance Digital Borivali",   area: "Borivali West",     station: "Borivali", cat: "Shopping", tags: ["electronics","reliance","digital"] },
  { name: "Croma Electronics Borivali",  area: "Borivali West",     station: "Borivali", cat: "Shopping", tags: ["electronics","croma","gadgets"] },
  { name: "Hypercity Borivali",          area: "Borivali East",     station: "Borivali", cat: "Mall",     tags: ["mall","hypercity","shopping"] },

  { name: "Sanjay Gandhi National Park", area: "Borivali East",     station: "Borivali", cat: "Nature",   tags: ["park","national park","sgnp","nature","trek","safari"] },
  { name: "Gorai Beach",                 area: "Borivali West",     station: "Borivali", cat: "Beach",    tags: ["beach","gorai","sea","leisure"] },
  { name: "Essel World",                 area: "Gorai, Borivali",   station: "Borivali", cat: "Leisure",  tags: ["essel world","amusement park","rides","theme park"] },
  { name: "Water Kingdom",               area: "Gorai, Borivali",   station: "Borivali", cat: "Leisure",  tags: ["water kingdom","water park","rides","theme park"] },
  { name: "Mandapeshwar Caves",          area: "Borivali West",     station: "Borivali", cat: "Heritage", tags: ["caves","heritage","mandapeshwar","history","temple"] },
  { name: "Aksa Beach",                  area: "Malad West",        station: "Borivali", cat: "Beach",    tags: ["beach","aksa","sea","picnic"] },

  { name: "Shankar Mandir Borivali",     area: "Borivali East",     station: "Borivali", cat: "Temple",   tags: ["temple","shiva","shankar","religious"] },
  { name: "ISKCON Borivali",             area: "Borivali West",     station: "Borivali", cat: "Temple",   tags: ["iskcon","temple","hare krishna","religious"] },
  { name: "Swaminarayan Temple Borivali",area: "Borivali West",     station: "Borivali", cat: "Temple",   tags: ["swaminarayan","temple","religious"] },
  { name: "Mount Mary Church Borivali",  area: "Borivali West",     station: "Borivali", cat: "Church",   tags: ["church","mount mary","christian"] },
  { name: "Kashi Vishwanath Temple",     area: "Borivali West",     station: "Borivali", cat: "Temple",   tags: ["temple","kashi","vishwanath","religious"] },

  { name: "HDFC Bank Borivali",          area: "Borivali West",     station: "Borivali", cat: "Bank",     tags: ["bank","hdfc","atm"] },
  { name: "ICICI Bank Borivali",         area: "Borivali West",     station: "Borivali", cat: "Bank",     tags: ["bank","icici","atm"] },
  { name: "SBI Bank Borivali",           area: "Borivali West",     station: "Borivali", cat: "Bank",     tags: ["bank","sbi","atm"] },
  { name: "Axis Bank Borivali",          area: "Borivali West",     station: "Borivali", cat: "Bank",     tags: ["bank","axis","atm"] },
  { name: "Kotak Bank Borivali",         area: "Borivali West",     station: "Borivali", cat: "Bank",     tags: ["bank","kotak","atm"] },
  { name: "Bank of Baroda Borivali",     area: "Borivali East",     station: "Borivali", cat: "Bank",     tags: ["bank","bob","atm"] },

  { name: "Apollo Pharmacy Borivali",    area: "Borivali West",     station: "Borivali", cat: "Pharmacy", tags: ["pharmacy","apollo","medicine"] },
  { name: "MedPlus Borivali",           area: "Borivali West",     station: "Borivali", cat: "Pharmacy", tags: ["pharmacy","medplus","medicine"] },
  { name: "Wellness Forever Borivali",  area: "Borivali West",     station: "Borivali", cat: "Pharmacy", tags: ["pharmacy","wellness","medicine"] },
  { name: "Netmeds Borivali",            area: "Borivali East",     station: "Borivali", cat: "Pharmacy", tags: ["pharmacy","netmeds","medicine"] },

  { name: "Ryan International Borivali",  area: "Borivali West",   station: "Borivali", cat: "School",   tags: ["school","ryan","education"] },
  { name: "St Joseph School Borivali",   area: "Borivali West",     station: "Borivali", cat: "School",   tags: ["school","st joseph","education"] },
  { name: "SIES College Borivali",       area: "Borivali West",     station: "Borivali", cat: "College",  tags: ["college","sies","education"] },
  { name: "Patkar Varde College Borivali",area:"Borivali West",     station: "Borivali", cat: "College",  tags: ["college","patkar","education"] },

  { name: "Gold's Gym Borivali",         area: "Borivali West",     station: "Borivali", cat: "Gym",      tags: ["gym","golds","fitness"] },
  { name: "Anytime Fitness Borivali",    area: "Borivali West",     station: "Borivali", cat: "Gym",      tags: ["gym","anytime fitness","fitness"] },
  { name: "Fitness First Borivali",      area: "Borivali East",     station: "Borivali", cat: "Gym",      tags: ["gym","fitness first","fitness"] },

  { name: "Hotel Residency Borivali",    area: "Borivali West",     station: "Borivali", cat: "Hotel",    tags: ["hotel","stay","lodge","residency"] },
  { name: "Hotel Keys Borivali",         area: "Borivali West",     station: "Borivali", cat: "Hotel",    tags: ["hotel","stay","keys","lodge"] },
  { name: "Hotel Regenza Inn Borivali",  area: "Borivali East",     station: "Borivali", cat: "Hotel",    tags: ["hotel","stay","regenza","lodge"] },

  { name: "MTNL Office Borivali",        area: "Borivali West",     station: "Borivali", cat: "Office",   tags: ["mtnl","telecom","office","government"] },
  { name: "Post Office Borivali",        area: "Borivali West",     station: "Borivali", cat: "Office",   tags: ["post office","government","postal"] },

];

// ── Search function ──────────────────────────────────────────────────────────
// Returns POIs that match the query string (name, area, tags)
export function searchPOI(query, limit = 8) {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();

  const scored = POI_LIST.map(poi => {
    const nameLower = poi.name.toLowerCase();
    const areaLower = poi.area.toLowerCase();

    let score = 0;
    // Name starts with query → highest priority
    if (nameLower.startsWith(q))                     score += 100;
    // Name contains query
    else if (nameLower.includes(q))                  score += 60;
    // Area matches
    if (areaLower.includes(q))                       score += 30;
    // Any tag matches
    if (poi.tags.some(t => t.includes(q)))           score += 40;
    // Tag starts with query
    if (poi.tags.some(t => t.startsWith(q)))         score += 20;
    // Word-boundary match in name (e.g. "mira" matches "Mira Road")
    const words = nameLower.split(/\s+/);
    if (words.some(w => w.startsWith(q)))            score += 50;

    return { poi, score };
  });

  return scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.poi);
}
