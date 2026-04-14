# VISTA – Voice Integrated Smart Transit Assistant

## ▶️ How to Run in VS Code

**Step 1:** Install Node.js from https://nodejs.org (LTS version)

**Step 2:** Extract this ZIP and open the VISTA-COMPLETE folder in VS Code

**Step 3:** Open terminal in VS Code → Ctrl + ` (backtick)

**Step 4:** Type this and press Enter:
```
npm install
```
(Wait 1–2 minutes, one time only)

**Step 5:** Type this and press Enter:
```
npm start
```
App opens automatically at http://localhost:3000 in Chrome.

---

## 📁 Project Structure (19 files, fully verified)

```
VISTA-COMPLETE/
├── package.json                  ← Only react + react-dom + react-scripts
├── public/
│   ├── index.html
│   └── manifest.json
└── src/
    ├── index.js                  ← Entry point
    ├── index.css                 ← All styles + CSS variables + animations
    ├── App.js                    ← Page routing + shared state
    ├── components/
    │   ├── GlobeLogo.jsx         ← Animated SVG globe
    │   ├── Navbar.jsx            ← Top navigation
    │   └── UI.jsx                ← Btn, Card, MicBtn, Badge, VoiceWave...
    ├── pages/
    │   ├── HomePage.jsx          ← Landing screen
    │   ├── LocationPage.jsx      ← GPS detection
    │   ├── DestinationPage.jsx   ← Voice + text place search
    │   ├── TrainsPage.jsx        ← Train timings + platform
    │   └── LastMilePage.jsx      ← Exit gate + last mile transport
    ├── data/
    │   └── transitData.js        ← 28 stations, 3 trains, 12 bus stops
    ├── hooks/
    │   └── useVoice.js           ← Speech recognition + synthesis
    └── utils/
        └── helpers.js            ← GPS, geocoding, bearing, distance logic
```

---

## 🎤 How to Use

1. Click **Start Journey** on the home screen
2. Click **Detect My Location** (allow location permission)
3. Tap the mic and say: *"Kala Ghoda Festival, Churchgate"*
   — or type any Mumbai landmark/place in the text box
4. App finds the place on OpenStreetMap (free, no API key)
5. Shows next trains + platform number
6. After arriving → shows exact exit gate + walking direction
7. Suggests Walk / Auto / Bus / Cab based on actual distance

**Use Google Chrome** for best voice support.

