import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WeatherPage from './pages/WeatherPage';
import CropAdvisorPage from './pages/CropAdvisorPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import IrrigationPage from './pages/IrrigationPage';
import MarketPricePage from './pages/MarketPricePage';
import SustainabilityPage from './pages/SustainabilityPage';
import SoilHealthPage from './pages/SoilHealthPage';
import SatelliteMapPage from './pages/SatelliteMapPage';
import LanguagePage from './pages/LanguagePage';
import GardeningPage from './pages/GardeningPage';
import Navbar from './components/Navbar';
import { LanguageProvider } from './context/LanguageContext';

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/weather" element={<AppLayout><WeatherPage /></AppLayout>} />
          <Route path="/crop-advisor" element={<AppLayout><CropAdvisorPage /></AppLayout>} />
          <Route path="/disease-detection" element={<AppLayout><DiseaseDetectionPage /></AppLayout>} />
          <Route path="/irrigation" element={<AppLayout><IrrigationPage /></AppLayout>} />
          <Route path="/market-prices" element={<AppLayout><MarketPricePage /></AppLayout>} />
          <Route path="/sustainability" element={<AppLayout><SustainabilityPage /></AppLayout>} />
          <Route path="/soil-health" element={<AppLayout><SoilHealthPage /></AppLayout>} />
          <Route path="/satellite-map" element={<AppLayout><SatelliteMapPage /></AppLayout>} />
          <Route path="/language-tool" element={<AppLayout><LanguagePage /></AppLayout>} />
          <Route path="/gardening" element={<AppLayout><GardeningPage /></AppLayout>} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
};

export default App;
