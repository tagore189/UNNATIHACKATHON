import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import WeatherPage from './pages/WeatherPage';
import CropAdvisorPage from './pages/CropAdvisorPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import IrrigationPage from './pages/IrrigationPage';
import PestAlertsPage from './pages/PestAlertsPage';
import MarketPricePage from './pages/MarketPricePage';
import SustainabilityPage from './pages/SustainabilityPage';
import Navbar from './components/Navbar';

const App = () => {
  // Protected Route wrapper component
  const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) return <Navigate to="/login" />;
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
        <Route path="/crop-advisor" element={<ProtectedRoute><CropAdvisorPage /></ProtectedRoute>} />
        <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>} />
        <Route path="/irrigation" element={<ProtectedRoute><IrrigationPage /></ProtectedRoute>} />
        <Route path="/pest-alerts" element={<ProtectedRoute><PestAlertsPage /></ProtectedRoute>} />
        <Route path="/market-prices" element={<ProtectedRoute><MarketPricePage /></ProtectedRoute>} />
        <Route path="/sustainability" element={<ProtectedRoute><SustainabilityPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;
