const express = require('express');
const axios = require('axios');
const Crop = require('../models/Crop');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Get Crop Recommendations
router.post('/recommend', async (req, res) => {
    try {
        const { soilType, season, location } = req.body;

        const query = { soilType, season };
        if (location) query.location = location;

        const crops = await Crop.find(query);

        // If local database has matching crops, return them
        if (crops.length > 0) {
            return res.json(crops);
        }

        // Otherwise generate personalized recommendations using Gemini AI
        const aiKey = process.env.GEMINI_API_KEY;
        if (!aiKey) {
            return res.json([
                {
                    name: 'Adaptable Wheat (Fallback, No AI Key)',
                    soilType,
                    season,
                    waterRequirement: 'Moderate',
                    growingPeriod: '120 days',
                    description: 'A resilient variety suited for various conditions.',
                    tips: ['Ensure proper drainage', 'Apply nitrogen-rich fertilizer']
                }
            ]);
        }

        const genAI = new GoogleGenerativeAI(aiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Act as an expert agronomist in India. Recommend 3 highly suitable crops for a farmer given the following conditions:
Soil Type: ${soilType}
Season: ${season}
Region/Location: ${location || 'India'}

Return the response STRICTLY as a raw JSON array of objects. Do not wrap it in markdown block quotes (no \`\`\`json). The objects must have exactly these keys:
[
  {
    "name": "Crop Name",
    "waterRequirement": "High/Medium/Low",
    "growingPeriod": "e.g., 90-120 days",
    "description": "Short explanation of why it fits the soil, season, and region.",
    "tips": ["Actionable farming tip 1", "Tip 2", "Tip 3"]
  }
]`;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text().trim();
        
        // Clean markdown backticks if Gemini still includes them
        if (rawText.startsWith("```json")) {
            rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        } else if (rawText.startsWith("```")) {
            rawText = rawText.replace(/```/g, "").trim();
        }

        const recommendations = JSON.parse(rawText);
        res.json(recommendations);

    } catch (err) {
        console.error("Gemini crop recommendation error:", err);
        // Fallback in case Gemini fails or parsing fails
        res.json([
            {
                name: 'Adaptable Wheat (AI Error Fallback)',
                waterRequirement: 'Moderate',
                growingPeriod: '120 days',
                description: 'A resilient variety returned because the AI service is currently overloaded.',
                tips: ['Ensure proper drainage', 'Apply nitrogen-rich fertilizer']
            }
        ]);
    }
});

// Get Weather Alerts
router.get('/weather/:location', async (req, res) => {
    try {
        const { location } = req.params;
        console.log('Weather request received for location:', location);

        // Using Open-Meteo (Free, No Key Required)
        // Defaulting to a central coordinate for demo purposes
        const lat = 20.5937, lon = 78.9629; // Central India

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code&timezone=auto`;

        console.log('Fetching from Open-Meteo:', weatherUrl);
        const response = await axios.get(weatherUrl, { timeout: 20000 });
        const data = response.data;

        const current = data.current;

        // Generate Farmer-friendly alerts based on weather code or precipitation
        let alerts = [];
        if (current.precipitation_probability > 50) {
            alerts.push('High chance of rain. Postpone any fertilizer application.');
        } else if (current.temperature_2m > 35) {
            alerts.push('Heatwave warning. Increase irrigation frequency.');
        } else {
            alerts.push('Weather conditions are stable for general farming activities.');
        }

        const weatherData = {
            location: location === 'FarmerLocation' ? 'Central Region' : location,
            temp: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            rainfallProbability: current.precipitation_probability,
            condition: 'Clear', // Simplified
            alerts: alerts
        };

        console.log('Weather data successfully fetched:', weatherData.location);
        res.json(weatherData);
    } catch (err) {
        console.error('Weather API Error:', err.message);
        console.log('Falling back to simulated weather data due to connection issues.');

        // Return simulated data so the frontend doesn't hang
        const fallbackData = {
            location: 'Central Region (Simulated)',
            temp: 24,
            humidity: 65,
            rainfallProbability: 10,
            condition: 'Clear',
            alerts: ['Demo mode: Using simulated data due to network connection issues.'],
            isSimulated: true
        };

        res.json(fallbackData);
    }
});

// Get Market Prices (Simulated)
router.get('/market-prices', (req, res) => {
    const marketData = [
        { market: 'Azadpur', state: 'Delhi', crop: 'Wheat', minPrice: 2100, maxPrice: 2400, modalPrice: 2250, date: '2026-03-12' },
        { market: 'Vashi', state: 'Maharashtra', crop: 'Wheat', minPrice: 2200, maxPrice: 2550, modalPrice: 2350, date: '2026-03-12' },
        { market: 'Kurnool', state: 'Andhra Pradesh', crop: 'Rice', minPrice: 1800, maxPrice: 2200, modalPrice: 2000, date: '2026-03-12' },
        { market: 'Burdwan', state: 'West Bengal', crop: 'Rice', minPrice: 1950, maxPrice: 2400, modalPrice: 2150, date: '2026-03-12' },
        { market: 'Indore', state: 'Madhya Pradesh', crop: 'Soybean', minPrice: 4200, maxPrice: 4800, modalPrice: 4500, date: '2026-03-12' },
        { market: 'Nagpur', state: 'Maharashtra', crop: 'Soybean', minPrice: 4100, maxPrice: 4700, modalPrice: 4400, date: '2026-03-12' },
        { market: 'Bathinda', state: 'Punjab', crop: 'Cotton', minPrice: 5500, maxPrice: 6200, modalPrice: 5850, date: '2026-03-12' },
        { market: 'Guntur', state: 'Andhra Pradesh', crop: 'Cotton', minPrice: 5800, maxPrice: 6500, modalPrice: 6100, date: '2026-03-12' },
        { market: 'Gulbarga', state: 'Karnataka', crop: 'Pigeon Pea (Tur)', minPrice: 6000, maxPrice: 7200, modalPrice: 6800, date: '2026-03-12' },
        { market: 'Latur', state: 'Maharashtra', crop: 'Pigeon Pea (Tur)', minPrice: 6200, maxPrice: 7500, modalPrice: 7000, date: '2026-03-12' },
    ];
    res.json(marketData);
});

module.exports = router;
