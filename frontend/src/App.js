// src/App.js
import React, { useState } from 'react';
import './index.css';
import Navbar        from './components/Navbar';
import EmergencyDrawer from './components/EmergencyDrawer';
import HomePage      from './pages/HomePage';
import LocationPage  from './pages/LocationPage';
import DestinationPage from './pages/DestinationPage';
import TrainsPage    from './pages/TrainsPage';
import LastMilePage  from './pages/LastMilePage';
import { useVoice }  from './hooks/useVoice';

useEffect(() => {
  console.log("API URL:", process.env.REACT_APP_API_URL);
}, []);

const GRID_PAGES = ['home', 'location', 'dest', 'trains'];

const INITIAL_STATE = {
  userLat: null, userLng: null, userAddress: '',
  nearestStation: null, nearestBusStop: null,
  destStation: null, destPlaceName: null, destPlaceCoords: null,
  selectedTrain: null, lastMileMode: null,
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [appState,    setAppState]    = useState(INITIAL_STATE);
  const { speak, startListening, stopListening, isListening, isSpeaking } = useVoice();

  const navigate = (page) => { setCurrentPage(page); window.scrollTo(0, 0); };

  const sharedProps = {
    appState, setAppState, onNavigate: navigate,
    speak, startListening, stopListening, isListening, isSpeaking,
  };

  return (
    <>
      {!GRID_PAGES.includes(currentPage) && (
        <>
          <div className="stars-bg" />
          <div className="ambient">
            <div className="blob blob1" />
            <div className="blob blob2" />
            <div className="blob blob3" />
          </div>
        </>
      )}

      {/* Navbar — now receives speak so LanguageSelector inside can confirm language change by voice */}
      <Navbar currentPage={currentPage} onNavigate={navigate} speak={speak} />

      {/* Emergency drawer — global, always mounted, floats ⚠️ on every page */}
      <EmergencyDrawer speak={speak} />

      {currentPage === 'home'     && <HomePage        {...sharedProps} />}
      {currentPage === 'location' && <LocationPage    {...sharedProps} />}
      {currentPage === 'dest'     && <DestinationPage {...sharedProps} />}
      {currentPage === 'trains'   && <TrainsPage      {...sharedProps} />}
      {currentPage === 'lastmile' && <LastMilePage    {...sharedProps} />}
    </>
  );
}
