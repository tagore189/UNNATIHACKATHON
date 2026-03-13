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

export const LanguageProvider = ({ children }) => {
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('userLanguage') || 'en');
    const [translations, setTranslations] = useState(BASE_STRINGS);
    const [isTranslating, setIsTranslating] = useState(false);

    // Load translations when language changes
    useEffect(() => {
        if (currentLang === 'en') {
            setTranslations(BASE_STRINGS);
            return;
        }

        // Check cache first
        const cacheKey = getCacheKey(currentLang);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                // Check if cache has all keys
                if (Object.keys(parsed).length >= Object.keys(BASE_STRINGS).length * 0.8) {
                    setTranslations(parsed);
                    return;
                }
            } catch (e) { /* ignore parse errors */ }
        }

        // Translate using backend
        translateAllStrings(currentLang);
    }, [currentLang]);

    const translateAllStrings = async (targetLang) => {
        setIsTranslating(true);
        const newTranslations = { ...BASE_STRINGS };
        const entries = Object.entries(BASE_STRINGS);

        // Translate in batches of 5 for speed
        const batchSize = 5;
        for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize);
            const promises = batch.map(async ([key, englishText]) => {
                try {
                    const res = await axios.post('http://localhost:5000/api/language/translate', {
                        text: englishText,
                        sourceLang: 'en',
                        targetLang: targetLang
                    });
                    if (res.data?.translated && !res.data.translated.startsWith('[Offline')) {
                        newTranslations[key] = res.data.translated;
                    }
                } catch (err) {
                    // Keep English fallback
                    console.warn(`Translation failed for "${key}":`, err.message);
                }
            });
            await Promise.all(promises);
        }

        // Cache the translations
        const cacheKey = getCacheKey(targetLang);
        localStorage.setItem(cacheKey, JSON.stringify(newTranslations));

        setTranslations(newTranslations);
        setIsTranslating(false);
    };

    const changeLanguage = useCallback((langCode) => {
        setCurrentLang(langCode);
        localStorage.setItem('userLanguage', langCode);
    }, []);

    const t = useCallback((key) => {
        return translations[key] || BASE_STRINGS[key] || key;
    }, [translations]);

    return (
        <LanguageContext.Provider value={{
            currentLang,
            changeLanguage,
            t,
            isTranslating,
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
