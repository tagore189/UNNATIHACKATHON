import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// All static UI strings used across the app — English is the base
const BASE_STRINGS = {
    // Navbar
    'dashboard': 'Dashboard',
    'weather': 'Weather',
    'crops': 'Crops',
    'enam_prices': 'eNAM Prices',
    'soil_health': 'Soil Health',
    'bhuvan_maps': 'Bhuvan Maps',
    'language': 'Language',
    'disease': 'Disease',
    'irrigation': 'Irrigation',
    'pest_alerts': 'Pest Alerts',
    'gardening': 'Gardening',
    'tips': 'Tips',

    // Landing Page
    'climate_smart_farming': 'Climate-Smart Farming',
    'for_greener_future': 'for a Greener Future',
    'landing_desc': 'Empowering farmers with real-time weather alerts and AI-driven crop recommendations to ensure sustainable and high-yield harvests.',
    'start_journey': 'Start Your Journey',
    'go_to_dashboard': 'Go to Dashboard',
    'weather_intelligence': 'Weather Intelligence',
    'weather_intel_desc': 'Receive precise weather alerts tailored to your farm\'s location.',
    'crop_recommendations': 'Crop Recommendations',
    'crop_rec_desc': 'Smart algorithms to suggest the best crops for your soil and season.',
    'sustainable_practices': 'Sustainable Practices',
    'sustainable_desc': 'Insights into eco-friendly farming to protect your land for generations.',

    // Dashboard
    'hello': 'Hello',
    'welcome_msg': 'Welcome to your farming command center — powered by IMD, ISRO Bhuvan, eNAM & AI4Bharat.',
    'imd_weather_alerts': 'IMD Weather & Alerts',
    'imd_weather_desc': 'IMD 7-day rainfall forecast, temperature data, cyclone alerts and farming advisories.',
    'enam_market_prices': 'eNAM Market Prices',
    'enam_desc': 'Live mandi prices from National Agriculture Market with MSP comparison and trade advice.',
    'soil_health_card': 'Soil Health Card',
    'soil_health_desc': 'NPK levels, soil pH, organic carbon, micronutrients and fertilizer recommendations.',
    'isro_bhuvan_maps': 'ISRO Bhuvan Maps',
    'bhuvan_desc': 'ISRO satellite imagery — NDVI, land use, soil moisture, and crop health layers.',
    'language_translation': 'Language Translation',
    'language_desc': 'AI4Bharat powered translation across 13 Indian languages with farming phrases.',
    'crop_recommendation': 'Crop Recommendation',
    'crop_rec_dashboard_desc': 'Personalized crop suggestions based on your soil type, season, and location.',
    'disease_detection': 'Disease Detection',
    'disease_desc': 'AI-powered crop disease identification and organic treatment recommendations.',
    'irrigation_advice': 'Irrigation Advice',
    'irrigation_desc': 'Smart watering schedules based on soil moisture and evapotranspiration data.',
    'pest_risk_alerts': 'Pest Risk Alerts',
    'pest_desc': 'Local pest outbreak notifications and preventive measures for your area.',
    'gardening_assistant': 'Gardening Assistant',
    'gardening_desc': 'AI-powered plant care for home gardeners — analyse plant health, get manure & watering tips.',
    'explore_module': 'Explore Module',
    'ready_optimize': 'Ready to optimize your farm?',
    'check_sustainability': 'Check our latest sustainability tips for a better harvest.',
    'view_more_tips': 'View More Tips',

    // Weather Page
    'smart_weather_advisory': 'Smart Weather Advisory',
    'detecting_location': 'Detecting Location...',
    'use_gps': 'Use My Current Location (GPS)',
    'major_cities': 'Major Cities',
    'states': 'States',
    'fetching_data': 'Fetching real-time satellite & IMD data...',
    'retry_fetch': 'Retry Fetch',
    'temperature': 'Temperature',
    'humidity': 'Humidity',
    'precipitation': 'Precipitation',
    'farmer_action_plan': 'Farmer Action Plan',
    'personalized_recs': 'Personalized recommendations based on local moisture & temp',
    '7_day_forecast': '7-Day Precision Forecast',
    'best_day': 'BEST DAY',
    'rain': 'Rain',
    'advice': 'Advice',
    'extreme_weather_alert': 'Extreme Weather Alert',
    'emergency_advisory': 'Emergency Farming Advisory',

    // Disease Detection
    'disease_detection_title': 'Crop Disease Detection',
    'upload_image': 'Click or drag an image here',
    'supports_formats': 'Supports JPG, PNG, WEBP up to 10MB',
    'analyze_image': 'Analyze Image',
    'common_diseases': 'Common Diseases',
    'common_diseases_desc': 'Learn about Blast, Blight, and Rust to take early preventive measures.',
    'pest_database': 'Pest Database',
    'pest_database_desc': 'Comprehensive guide on identifying and controlling major crop pests.',
    'analyzing': 'Analyzing...',

    // General
    'loading': 'Loading...',
    'error': 'Error',
    'data_source': 'Data Source',
    'last_updated': 'Last Updated',
    'scanner_ready': 'Scanner Ready',
    'alert_active': 'Alert Active',
    'gov_data': 'Gov. Data',
    'satellite': 'Satellite',
    'ai_powered': 'AI Powered',
    '13_languages': '13 Languages',
    '3_matches': '3 Matches',
    'clear': 'Clear',
};

const LanguageContext = createContext();

// Cache key for localStorage
const getCacheKey = (lang) => `agriguard_translations_${lang}`;

const STATE_LANGUAGE_MAP = {
    'Andhra Pradesh': 'te',
    'Telangana': 'te',
    'Tamil Nadu': 'ta',
    'Karnataka': 'kn',
    'Maharashtra': 'mr',
    'Gujarat': 'gu',
    'West Bengal': 'bn',
    'Punjab': 'pa',
    'Kerala': 'ml',
    'Odisha': 'or',
    'Uttar Pradesh': 'hi',
    'Madhya Pradesh': 'hi',
    'Bihar': 'hi',
    'Rajasthan': 'hi',
    'Haryana': 'hi',
    'Delhi': 'hi',
    'Jharkhand': 'hi',
    'Chhattisgarh': 'hi'
};

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('userLanguage') || 'en');
    
    // Always provide the English strings so Google Translate can translate them in the DOM
    const t = useCallback((key) => BASE_STRINGS[key] || key, []);

    const triggerGoogleTranslate = useCallback((langCode) => {
        if (langCode === 'en') {
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
            if (document.cookie.includes('googtrans') || document.documentElement.className.includes('translated-')) {
                window.location.reload();
            }
            return;
        }

        let attempts = 0;
        const maxAttempts = 20;
        const tryTranslate = setInterval(() => {
            attempts++;
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                clearInterval(tryTranslate);
            } else if (attempts >= maxAttempts) {
                clearInterval(tryTranslate);
            }
        }, 300);
    }, []);

    const changeLanguage = useCallback((langCode) => {
        setCurrentLang(langCode);
        localStorage.setItem('userLanguage', langCode);
        triggerGoogleTranslate(langCode);
    }, [triggerGoogleTranslate]);

    // Apply translation on mount if there's a stored language
    useEffect(() => {
        const stored = localStorage.getItem('userLanguage');
        if (stored && stored !== 'en') {
            triggerGoogleTranslate(stored);
        }
    }, [triggerGoogleTranslate]);

    // Auto-detect language based on IP location if not set yet
    useEffect(() => {
        const autoSetLanguage = async () => {
            const storedLang = localStorage.getItem('userLanguage');
            if (!storedLang) {
                try {
                    const res = await axios.get('https://ipapi.co/json/');
                    const stateName = res.data.region;
                    const detectedLang = STATE_LANGUAGE_MAP[stateName] || 'en';
                    changeLanguage(detectedLang);
                    localStorage.setItem('userState', stateName);
                } catch (err) {
                    console.warn("Could not auto-detect location for language:", err.message);
                }
            }
        };
        autoSetLanguage();
    }, [changeLanguage]);

    return (
        <LanguageContext.Provider value={{
            currentLang,
            changeLanguage,
            t,
            BASE_STRINGS
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export default LanguageContext;
