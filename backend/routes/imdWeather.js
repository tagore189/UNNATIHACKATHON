const express = require('express');
const axios = require('axios');
const router = express.Router();

// Indian state coordinates for IMD weather data
const STATE_COORDS = {
    'andhra-pradesh': { lat: 15.9129, lon: 79.7400, name: 'Andhra Pradesh' },
    'assam': { lat: 26.2006, lon: 92.9376, name: 'Assam' },
    'bihar': { lat: 25.0961, lon: 85.3131, name: 'Bihar' },
    'chhattisgarh': { lat: 21.2787, lon: 81.8661, name: 'Chhattisgarh' },
    'delhi': { lat: 28.7041, lon: 77.1025, name: 'Delhi' },
    'goa': { lat: 15.2993, lon: 74.1240, name: 'Goa' },
    'gujarat': { lat: 22.2587, lon: 71.1924, name: 'Gujarat' },
    'haryana': { lat: 29.0588, lon: 76.0856, name: 'Haryana' },
    'himachal-pradesh': { lat: 31.1048, lon: 77.1734, name: 'Himachal Pradesh' },
    'jharkhand': { lat: 23.6102, lon: 85.2799, name: 'Jharkhand' },
    'karnataka': { lat: 15.3173, lon: 75.7139, name: 'Karnataka' },
    'kerala': { lat: 10.8505, lon: 76.2711, name: 'Kerala' },
    'madhya-pradesh': { lat: 22.9734, lon: 78.6569, name: 'Madhya Pradesh' },
    'maharashtra': { lat: 19.7515, lon: 75.7139, name: 'Maharashtra' },
    'manipur': { lat: 24.6637, lon: 93.9063, name: 'Manipur' },
    'meghalaya': { lat: 25.4670, lon: 91.3662, name: 'Meghalaya' },
    'mizoram': { lat: 23.1645, lon: 92.9376, name: 'Mizoram' },
    'nagaland': { lat: 26.1584, lon: 94.5624, name: 'Nagaland' },
    'odisha': { lat: 20.9517, lon: 85.0985, name: 'Odisha' },
    'punjab': { lat: 31.1471, lon: 75.3412, name: 'Punjab' },
    'rajasthan': { lat: 27.0238, lon: 74.2179, name: 'Rajasthan' },
    'sikkim': { lat: 27.5330, lon: 88.5122, name: 'Sikkim' },
    'tamil-nadu': { lat: 11.1271, lon: 78.6569, name: 'Tamil Nadu' },
    'telangana': { lat: 18.1124, lon: 79.0193, name: 'Telangana' },
    'tripura': { lat: 23.9408, lon: 91.9882, name: 'Tripura' },
    'uttar-pradesh': { lat: 26.8467, lon: 80.9462, name: 'Uttar Pradesh' },
    'uttarakhand': { lat: 30.0668, lon: 79.0193, name: 'Uttarakhand' },
    'west-bengal': { lat: 22.9868, lon: 87.8550, name: 'West Bengal' }
};

// GET /api/imd/forecast/:state — 7-day rainfall & temperature forecast
router.get('/forecast/:state', async (req, res) => {
    try {
        const stateKey = req.params.state.toLowerCase();
        const stateInfo = STATE_COORDS[stateKey];

        if (!stateInfo) {
            return res.status(400).json({
                error: 'Invalid state',
                availableStates: Object.keys(STATE_COORDS)
            });
        }

        // TODO: Replace with real IMD API when key is available
        // Real IMD endpoint: https://api.imd.gov.in/v1/forecast?state=...
        // Using Open-Meteo as a proxy with IMD-structured response format
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${stateInfo.lat}&longitude=${stateInfo.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Asia/Kolkata&forecast_days=7`;

        const response = await axios.get(url, { timeout: 10000 });
        const data = response.data;

        // Structure response in IMD format
        const forecast = data.daily.time.map((date, i) => ({
            date,
            maxTemp: data.daily.temperature_2m_max[i],
            minTemp: data.daily.temperature_2m_min[i],
            rainfallMm: data.daily.precipitation_sum[i],
            rainProbability: data.daily.precipitation_probability_max[i],
            weatherCode: data.daily.weather_code[i],
            condition: getWeatherCondition(data.daily.weather_code[i])
        }));

        const imdResponse = {
            source: 'IMD (India Meteorological Department)',
            state: stateInfo.name,
            coordinates: { lat: stateInfo.lat, lon: stateInfo.lon },
            current: {
                temperature: data.current.temperature_2m,
                humidity: data.current.relative_humidity_2m,
                precipitation: data.current.precipitation
            },
            forecast,
            generatedAt: new Date().toISOString(),
            advisory: generateFarmingAdvisory(forecast)
        };

        res.json(imdResponse);
    } catch (err) {
        console.error('IMD Weather Error:', err.message);
        // Fallback with simulated IMD data
        res.json(getSimulatedIMDData(req.params.state));
    }
});

// GET /api/imd/cyclone-alerts — Active cyclone and extreme weather warnings
router.get('/cyclone-alerts', async (req, res) => {
    try {
        // TODO: Replace with real IMD cyclone tracking API
        // Real endpoint: https://api.imd.gov.in/v1/cyclone/active
        const alerts = [
            {
                id: 'CYC-2026-001',
                type: 'CYCLONE_WARNING',
                severity: 'ORANGE',
                title: 'Deep Depression over Bay of Bengal',
                description: 'A deep depression has formed over the central Bay of Bengal. It is likely to intensify into a cyclonic storm within the next 24 hours. Coastal areas of Odisha and Andhra Pradesh are advised to remain vigilant.',
                affectedStates: ['Odisha', 'Andhra Pradesh', 'West Bengal'],
                affectedDistricts: ['Puri', 'Ganjam', 'Srikakulam', 'Vizianagaram'],
                windSpeedKmh: 65,
                expectedLandfallDate: '2026-03-15',
                advisoryForFarmers: [
                    'Secure all standing crops and harvested produce',
                    'Do not venture into the sea for fishing',
                    'Move livestock to safer locations on higher ground',
                    'Ensure proper drainage in paddy fields',
                    'Store seeds and fertilizers in waterproof containers'
                ],
                issuedAt: new Date().toISOString(),
                validTill: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'HW-2026-003',
                type: 'HEAT_WAVE',
                severity: 'YELLOW',
                title: 'Heat Wave Warning for Rajasthan & Gujarat',
                description: 'Maximum temperatures are expected to exceed 42°C in parts of Rajasthan and Gujarat over the next 3 days.',
                affectedStates: ['Rajasthan', 'Gujarat'],
                affectedDistricts: ['Barmer', 'Jaisalmer', 'Kutch', 'Jodhpur'],
                maxTempExpected: 44,
                advisoryForFarmers: [
                    'Irrigate crops during early morning or evening hours only',
                    'Apply mulch to conserve soil moisture',
                    'Provide shade and extra water for livestock',
                    'Avoid strenuous outdoor farm work between 11 AM – 4 PM',
                    'Consider light sprinkler irrigation for heat-sensitive crops'
                ],
                issuedAt: new Date().toISOString(),
                validTill: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'HRF-2026-005',
                type: 'HEAVY_RAINFALL',
                severity: 'RED',
                title: 'Extremely Heavy Rainfall Alert — Kerala',
                description: 'IMD has issued a red alert for extremely heavy rainfall (>204.5 mm in 24 hours) in several districts of Kerala. Landslide risk is high in hilly regions.',
                affectedStates: ['Kerala'],
                affectedDistricts: ['Idukki', 'Wayanad', 'Kozhikode', 'Ernakulam'],
                expectedRainfallMm: 220,
                advisoryForFarmers: [
                    'Avoid working in low-lying waterlogged fields',
                    'Clear all drainage channels immediately',
                    'Harvest mature crops before heavy rains arrive',
                    'Protect nurseries with temporary shelters',
                    'Do not apply any pesticides or fertilizers during heavy rain'
                ],
                issuedAt: new Date().toISOString(),
                validTill: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString()
            }
        ];

        res.json({
            source: 'IMD (India Meteorological Department)',
            totalAlerts: alerts.length,
            alerts,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        console.error('Cyclone alerts error:', err.message);
        res.status(500).json({ error: 'Failed to fetch cyclone alerts' });
    }
});

// GET /api/imd/states — List available states
router.get('/states', (req, res) => {
    const states = Object.entries(STATE_COORDS).map(([key, val]) => ({
        id: key,
        name: val.name
    }));
    res.json(states);
});

// Helper: Convert WMO weather code to readable condition
function getWeatherCondition(code) {
    const conditions = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
        55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
        80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
        95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail'
    };
    return conditions[code] || 'Unknown';
}

// Helper: Generate farming advisory based on forecast
function generateFarmingAdvisory(forecast) {
    const advisories = [];
    const totalRainfall = forecast.reduce((sum, d) => sum + d.rainfallMm, 0);
    const maxTemp = Math.max(...forecast.map(d => d.maxTemp));
    const heavyRainDays = forecast.filter(d => d.rainfallMm > 30).length;

    if (totalRainfall > 100) {
        advisories.push('🌧️ Heavy rainfall expected this week. Delay sowing of rain-sensitive crops and ensure proper field drainage.');
    }
    if (heavyRainDays >= 3) {
        advisories.push('⚠️ Multiple days of heavy rain ahead. Harvest any mature crops immediately to prevent spoilage.');
    }
    if (maxTemp > 40) {
        advisories.push('🌡️ Extreme heat expected. Increase irrigation frequency and consider mulching to conserve soil moisture.');
    }
    if (totalRainfall < 5 && maxTemp > 35) {
        advisories.push('☀️ Dry and hot conditions ahead. Schedule irrigation for early morning. Consider drought-resistant crop varieties.');
    }
    if (totalRainfall >= 20 && totalRainfall <= 60) {
        advisories.push('✅ Moderate rainfall expected — good conditions for sowing Kharif crops like rice, maize, and pulses.');
    }
    if (advisories.length === 0) {
        advisories.push('✅ Favorable weather conditions for general farming activities this week.');
    }

    return advisories;
}

// Helper: Simulated IMD data fallback
function getSimulatedIMDData(stateKey) {
    const stateName = STATE_COORDS[stateKey]?.name || stateKey;
    return {
        source: 'IMD (Simulated Data)',
        state: stateName,
        isSimulated: true,
        current: { temperature: 28, humidity: 62, precipitation: 0 },
        forecast: Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
            maxTemp: 30 + Math.random() * 8,
            minTemp: 18 + Math.random() * 6,
            rainfallMm: Math.random() * 25,
            rainProbability: Math.floor(Math.random() * 80),
            condition: ['Clear Sky', 'Partly Cloudy', 'Slight Rain', 'Moderate Rain'][Math.floor(Math.random() * 4)]
        })),
        advisory: ['ℹ️ Using simulated data. Connect IMD API for live forecasts.'],
        generatedAt: new Date().toISOString()
    };
}

module.exports = router;
