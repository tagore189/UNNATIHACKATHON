const express = require('express');
const router = express.Router();

const COMMODITIES = [
    'Wheat', 'Rice (Paddy)', 'Maize', 'Bajra', 'Jowar',
    'Soybean', 'Groundnut', 'Mustard', 'Cotton', 'Sugarcane',
    'Onion', 'Potato', 'Tomato', 'Green Chilli', 'Turmeric',
    'Pigeon Pea (Tur)', 'Gram (Chana)', 'Moong', 'Urad', 'Masoor',
    'Banana', 'Mango', 'Apple', 'Orange', 'Pomegranate'
];

// Comprehensive market data for all 28 Indian states
const MARKET_DATA = [
    // ── WHEAT ──────────────────────────────────────────────
    { commodity: 'Wheat', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 2100, maxPrice: 2450, modalPrice: 2275, unit: 'Quintal', arrivals: 1240, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Karnal', state: 'Haryana', district: 'Karnal', minPrice: 2200, maxPrice: 2500, modalPrice: 2350, unit: 'Quintal', arrivals: 3500, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Hathras', state: 'Uttar Pradesh', district: 'Hathras', minPrice: 2050, maxPrice: 2400, modalPrice: 2200, unit: 'Quintal', arrivals: 890, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 2150, maxPrice: 2480, modalPrice: 2300, unit: 'Quintal', arrivals: 2100, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Amritsar', state: 'Punjab', district: 'Amritsar', minPrice: 2250, maxPrice: 2550, modalPrice: 2400, unit: 'Quintal', arrivals: 4800, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Bikaner', state: 'Rajasthan', district: 'Bikaner', minPrice: 2100, maxPrice: 2430, modalPrice: 2260, unit: 'Quintal', arrivals: 2900, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Gorakhpur', state: 'Uttar Pradesh', district: 'Gorakhpur', minPrice: 2080, maxPrice: 2420, modalPrice: 2220, unit: 'Quintal', arrivals: 1200, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Patna', state: 'Bihar', district: 'Patna', minPrice: 2050, maxPrice: 2400, modalPrice: 2190, unit: 'Quintal', arrivals: 750, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Dehradun', state: 'Uttarakhand', district: 'Dehradun', minPrice: 2150, maxPrice: 2470, modalPrice: 2310, unit: 'Quintal', arrivals: 420, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Shimla', state: 'Himachal Pradesh', district: 'Shimla', minPrice: 2200, maxPrice: 2530, modalPrice: 2360, unit: 'Quintal', arrivals: 310, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Ranchi', state: 'Jharkhand', district: 'Ranchi', minPrice: 2100, maxPrice: 2450, modalPrice: 2270, unit: 'Quintal', arrivals: 580, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Raipur', state: 'Chhattisgarh', district: 'Raipur', minPrice: 2120, maxPrice: 2460, modalPrice: 2280, unit: 'Quintal', arrivals: 920, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Nagpur', state: 'Maharashtra', district: 'Nagpur', minPrice: 2180, maxPrice: 2500, modalPrice: 2340, unit: 'Quintal', arrivals: 1100, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Gurgaon', state: 'Haryana', district: 'Gurugram', minPrice: 2220, maxPrice: 2520, modalPrice: 2370, unit: 'Quintal', arrivals: 1600, msp: 2275, date: '2026-03-12' },

    // ── RICE (PADDY) ────────────────────────────────────────
    { commodity: 'Rice (Paddy)', market: 'Kurnool', state: 'Andhra Pradesh', district: 'Kurnool', minPrice: 1800, maxPrice: 2300, modalPrice: 2080, unit: 'Quintal', arrivals: 1800, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Burdwan', state: 'West Bengal', district: 'Purba Bardhaman', minPrice: 1950, maxPrice: 2400, modalPrice: 2150, unit: 'Quintal', arrivals: 2200, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Thanjavur', state: 'Tamil Nadu', district: 'Thanjavur', minPrice: 2000, maxPrice: 2350, modalPrice: 2175, unit: 'Quintal', arrivals: 1500, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Nizamabad', state: 'Telangana', district: 'Nizamabad', minPrice: 1900, maxPrice: 2280, modalPrice: 2100, unit: 'Quintal', arrivals: 3200, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Raipur', state: 'Chhattisgarh', district: 'Raipur', minPrice: 2000, maxPrice: 2350, modalPrice: 2180, unit: 'Quintal', arrivals: 4100, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Guwahati', state: 'Assam', district: 'Kamrup', minPrice: 1850, maxPrice: 2200, modalPrice: 2020, unit: 'Quintal', arrivals: 2800, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Patna', state: 'Bihar', district: 'Patna', minPrice: 1900, maxPrice: 2250, modalPrice: 2060, unit: 'Quintal', arrivals: 1700, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Bhubaneswar', state: 'Odisha', district: 'Khordha', minPrice: 1880, maxPrice: 2230, modalPrice: 2050, unit: 'Quintal', arrivals: 2500, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Mangalore', state: 'Karnataka', district: 'Dakshina Kannada', minPrice: 1950, maxPrice: 2300, modalPrice: 2120, unit: 'Quintal', arrivals: 980, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Kochi', state: 'Kerala', district: 'Ernakulam', minPrice: 2100, maxPrice: 2500, modalPrice: 2300, unit: 'Quintal', arrivals: 600, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Imphal', state: 'Manipur', district: 'Imphal West', minPrice: 1800, maxPrice: 2150, modalPrice: 1980, unit: 'Quintal', arrivals: 350, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Agartala', state: 'Tripura', district: 'West Tripura', minPrice: 1820, maxPrice: 2180, modalPrice: 2000, unit: 'Quintal', arrivals: 280, msp: 2203, date: '2026-03-12' },

    // ── SOYBEAN ─────────────────────────────────────────────
    { commodity: 'Soybean', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 4200, maxPrice: 4850, modalPrice: 4525, unit: 'Quintal', arrivals: 4200, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Nagpur', state: 'Maharashtra', district: 'Nagpur', minPrice: 4100, maxPrice: 4750, modalPrice: 4400, unit: 'Quintal', arrivals: 1800, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Latur', state: 'Maharashtra', district: 'Latur', minPrice: 4250, maxPrice: 4900, modalPrice: 4600, unit: 'Quintal', arrivals: 2500, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Raipur', state: 'Chhattisgarh', district: 'Raipur', minPrice: 4100, maxPrice: 4700, modalPrice: 4380, unit: 'Quintal', arrivals: 1200, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Rajkot', state: 'Gujarat', district: 'Rajkot', minPrice: 4300, maxPrice: 4950, modalPrice: 4620, unit: 'Quintal', arrivals: 900, msp: 4600, date: '2026-03-12' },

    // ── COTTON ──────────────────────────────────────────────
    { commodity: 'Cotton', market: 'Bathinda', state: 'Punjab', district: 'Bathinda', minPrice: 5500, maxPrice: 6300, modalPrice: 5900, unit: 'Quintal', arrivals: 950, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Guntur', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 5800, maxPrice: 6600, modalPrice: 6200, unit: 'Quintal', arrivals: 1200, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Rajkot', state: 'Gujarat', district: 'Rajkot', minPrice: 5600, maxPrice: 6400, modalPrice: 6000, unit: 'Quintal', arrivals: 2800, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Hingoli', state: 'Maharashtra', district: 'Hingoli', minPrice: 5700, maxPrice: 6500, modalPrice: 6100, unit: 'Quintal', arrivals: 1600, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Sirsa', state: 'Haryana', district: 'Sirsa', minPrice: 5550, maxPrice: 6350, modalPrice: 5950, unit: 'Quintal', arrivals: 720, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Adilabad', state: 'Telangana', district: 'Adilabad', minPrice: 5900, maxPrice: 6700, modalPrice: 6300, unit: 'Quintal', arrivals: 1400, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Nanded', state: 'Maharashtra', district: 'Nanded', minPrice: 5750, maxPrice: 6550, modalPrice: 6150, unit: 'Quintal', arrivals: 1100, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Hanumangarh', state: 'Rajasthan', district: 'Hanumangarh', minPrice: 5600, maxPrice: 6400, modalPrice: 6000, unit: 'Quintal', arrivals: 840, msp: 7121, date: '2026-03-12' },

    // ── ONION ───────────────────────────────────────────────
    { commodity: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 800, maxPrice: 1800, modalPrice: 1250, unit: 'Quintal', arrivals: 12000, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 1000, maxPrice: 2000, modalPrice: 1500, unit: 'Quintal', arrivals: 5500, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Hubli', state: 'Karnataka', district: 'Dharwad', minPrice: 900, maxPrice: 1900, modalPrice: 1350, unit: 'Quintal', arrivals: 3200, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Agra', state: 'Uttar Pradesh', district: 'Agra', minPrice: 950, maxPrice: 1950, modalPrice: 1400, unit: 'Quintal', arrivals: 2800, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Madurai', state: 'Tamil Nadu', district: 'Madurai', minPrice: 1100, maxPrice: 2100, modalPrice: 1600, unit: 'Quintal', arrivals: 1900, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 850, maxPrice: 1800, modalPrice: 1300, unit: 'Quintal', arrivals: 2100, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Rajkot', state: 'Gujarat', district: 'Rajkot', minPrice: 900, maxPrice: 1850, modalPrice: 1320, unit: 'Quintal', arrivals: 1700, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Bikaner', state: 'Rajasthan', district: 'Bikaner', minPrice: 880, maxPrice: 1820, modalPrice: 1310, unit: 'Quintal', arrivals: 1400, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', minPrice: 1050, maxPrice: 2050, modalPrice: 1550, unit: 'Quintal', arrivals: 3100, msp: null, date: '2026-03-12' },

    // ── TOMATO ──────────────────────────────────────────────
    { commodity: 'Tomato', market: 'Kolar', state: 'Karnataka', district: 'Kolar', minPrice: 500, maxPrice: 1500, modalPrice: 900, unit: 'Quintal', arrivals: 8000, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Madanapalle', state: 'Andhra Pradesh', district: 'Annamayya', minPrice: 600, maxPrice: 1600, modalPrice: 1050, unit: 'Quintal', arrivals: 6200, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Nashik', state: 'Maharashtra', district: 'Nashik', minPrice: 700, maxPrice: 1700, modalPrice: 1100, unit: 'Quintal', arrivals: 4500, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 800, maxPrice: 1800, modalPrice: 1200, unit: 'Quintal', arrivals: 3800, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Coimbatore', state: 'Tamil Nadu', district: 'Coimbatore', minPrice: 650, maxPrice: 1650, modalPrice: 1050, unit: 'Quintal', arrivals: 3200, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', minPrice: 700, maxPrice: 1700, modalPrice: 1100, unit: 'Quintal', arrivals: 2600, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Kolkata', state: 'West Bengal', district: 'Kolkata', minPrice: 750, maxPrice: 1750, modalPrice: 1150, unit: 'Quintal', arrivals: 2900, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', minPrice: 600, maxPrice: 1600, modalPrice: 1000, unit: 'Quintal', arrivals: 5100, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Thrissur', state: 'Kerala', district: 'Thrissur', minPrice: 900, maxPrice: 1900, modalPrice: 1350, unit: 'Quintal', arrivals: 1400, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad', minPrice: 700, maxPrice: 1700, modalPrice: 1100, unit: 'Quintal', arrivals: 2200, msp: null, date: '2026-03-12' },

    // ── POTATO ──────────────────────────────────────────────
    { commodity: 'Potato', market: 'Agra', state: 'Uttar Pradesh', district: 'Agra', minPrice: 400, maxPrice: 900, modalPrice: 650, unit: 'Quintal', arrivals: 9500, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Kolkata', state: 'West Bengal', district: 'Kolkata', minPrice: 500, maxPrice: 1000, modalPrice: 730, unit: 'Quintal', arrivals: 6200, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Patna', state: 'Bihar', district: 'Patna', minPrice: 420, maxPrice: 920, modalPrice: 660, unit: 'Quintal', arrivals: 4100, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 450, maxPrice: 950, modalPrice: 680, unit: 'Quintal', arrivals: 3800, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 550, maxPrice: 1050, modalPrice: 780, unit: 'Quintal', arrivals: 5500, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Pune', state: 'Maharashtra', district: 'Pune', minPrice: 500, maxPrice: 1000, modalPrice: 720, unit: 'Quintal', arrivals: 4200, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Ahmedabad', state: 'Gujarat', district: 'Ahmedabad', minPrice: 480, maxPrice: 980, modalPrice: 710, unit: 'Quintal', arrivals: 3100, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Shimla', state: 'Himachal Pradesh', district: 'Shimla', minPrice: 600, maxPrice: 1100, modalPrice: 830, unit: 'Quintal', arrivals: 1800, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Ranchi', state: 'Jharkhand', district: 'Ranchi', minPrice: 440, maxPrice: 940, modalPrice: 670, unit: 'Quintal', arrivals: 1900, msp: null, date: '2026-03-12' },
    { commodity: 'Potato', market: 'Gangtok', state: 'Sikkim', district: 'East Sikkim', minPrice: 700, maxPrice: 1200, modalPrice: 920, unit: 'Quintal', arrivals: 380, msp: null, date: '2026-03-12' },

    // ── PIGEON PEA ──────────────────────────────────────────
    { commodity: 'Pigeon Pea (Tur)', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 6200, maxPrice: 7400, modalPrice: 6850, unit: 'Quintal', arrivals: 800, msp: 7000, date: '2026-03-12' },
    { commodity: 'Pigeon Pea (Tur)', market: 'Latur', state: 'Maharashtra', district: 'Latur', minPrice: 6400, maxPrice: 7600, modalPrice: 7050, unit: 'Quintal', arrivals: 1100, msp: 7000, date: '2026-03-12' },
    { commodity: 'Pigeon Pea (Tur)', market: 'Adilabad', state: 'Telangana', district: 'Adilabad', minPrice: 6300, maxPrice: 7500, modalPrice: 6950, unit: 'Quintal', arrivals: 640, msp: 7000, date: '2026-03-12' },
    { commodity: 'Pigeon Pea (Tur)', market: 'Gwalior', state: 'Madhya Pradesh', district: 'Gwalior', minPrice: 6100, maxPrice: 7300, modalPrice: 6750, unit: 'Quintal', arrivals: 920, msp: 7000, date: '2026-03-12' },
    { commodity: 'Pigeon Pea (Tur)', market: 'Raichur', state: 'Karnataka', district: 'Raichur', minPrice: 6250, maxPrice: 7450, modalPrice: 6880, unit: 'Quintal', arrivals: 700, msp: 7000, date: '2026-03-12' },

    // ── GRAM (CHANA) ───────────────────────────────────────
    { commodity: 'Gram (Chana)', market: 'Bikaner', state: 'Rajasthan', district: 'Bikaner', minPrice: 4800, maxPrice: 5600, modalPrice: 5200, unit: 'Quintal', arrivals: 3200, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Vidisha', state: 'Madhya Pradesh', district: 'Vidisha', minPrice: 4900, maxPrice: 5700, modalPrice: 5300, unit: 'Quintal', arrivals: 2800, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 4850, maxPrice: 5650, modalPrice: 5250, unit: 'Quintal', arrivals: 1900, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 4950, maxPrice: 5750, modalPrice: 5350, unit: 'Quintal', arrivals: 3100, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', minPrice: 4820, maxPrice: 5620, modalPrice: 5220, unit: 'Quintal', arrivals: 2500, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Hoshangabad', state: 'Madhya Pradesh', district: 'Narmadapuram', minPrice: 4900, maxPrice: 5700, modalPrice: 5280, unit: 'Quintal', arrivals: 2200, msp: 5440, date: '2026-03-12' },

    // ── MUSTARD ─────────────────────────────────────────────
    { commodity: 'Mustard', market: 'Alwar', state: 'Rajasthan', district: 'Alwar', minPrice: 4800, maxPrice: 5500, modalPrice: 5150, unit: 'Quintal', arrivals: 1500, msp: 5650, date: '2026-03-12' },
    { commodity: 'Mustard', market: 'Bharatpur', state: 'Rajasthan', district: 'Bharatpur', minPrice: 4850, maxPrice: 5550, modalPrice: 5200, unit: 'Quintal', arrivals: 2200, msp: 5650, date: '2026-03-12' },
    { commodity: 'Mustard', market: 'Mathura', state: 'Uttar Pradesh', district: 'Mathura', minPrice: 4900, maxPrice: 5600, modalPrice: 5230, unit: 'Quintal', arrivals: 1800, msp: 5650, date: '2026-03-12' },
    { commodity: 'Mustard', market: 'Karnal', state: 'Haryana', district: 'Karnal', minPrice: 4900, maxPrice: 5600, modalPrice: 5220, unit: 'Quintal', arrivals: 1100, msp: 5650, date: '2026-03-12' },
    { commodity: 'Mustard', market: 'Morena', state: 'Madhya Pradesh', district: 'Morena', minPrice: 4820, maxPrice: 5520, modalPrice: 5160, unit: 'Quintal', arrivals: 1300, msp: 5650, date: '2026-03-12' },

    // ── TURMERIC ─────────────────────────────────────────────
    { commodity: 'Turmeric', market: 'Erode', state: 'Tamil Nadu', district: 'Erode', minPrice: 8000, maxPrice: 14000, modalPrice: 11000, unit: 'Quintal', arrivals: 650, msp: null, date: '2026-03-12' },
    { commodity: 'Turmeric', market: 'Nizamabad', state: 'Telangana', district: 'Nizamabad', minPrice: 7500, maxPrice: 13500, modalPrice: 10500, unit: 'Quintal', arrivals: 900, msp: null, date: '2026-03-12' },
    { commodity: 'Turmeric', market: 'Sangli', state: 'Maharashtra', district: 'Sangli', minPrice: 7800, maxPrice: 13800, modalPrice: 10800, unit: 'Quintal', arrivals: 480, msp: null, date: '2026-03-12' },
    { commodity: 'Turmeric', market: 'Duggirala', state: 'Andhra Pradesh', district: 'Eluru', minPrice: 7600, maxPrice: 13600, modalPrice: 10600, unit: 'Quintal', arrivals: 520, msp: null, date: '2026-03-12' },
    { commodity: 'Turmeric', market: 'Jagdalpur', state: 'Chhattisgarh', district: 'Bastar', minPrice: 7200, maxPrice: 13200, modalPrice: 10200, unit: 'Quintal', arrivals: 240, msp: null, date: '2026-03-12' },

    // ── GROUNDNUT ────────────────────────────────────────────
    { commodity: 'Groundnut', market: 'Junagadh', state: 'Gujarat', district: 'Junagadh', minPrice: 5000, maxPrice: 5800, modalPrice: 5400, unit: 'Quintal', arrivals: 1800, msp: 6377, date: '2026-03-12' },
    { commodity: 'Groundnut', market: 'Anantapur', state: 'Andhra Pradesh', district: 'Anantapur', minPrice: 5100, maxPrice: 5900, modalPrice: 5500, unit: 'Quintal', arrivals: 2400, msp: 6377, date: '' + '2026-03-12' },
    { commodity: 'Groundnut', market: 'Bellary', state: 'Karnataka', district: 'Ballari', minPrice: 5050, maxPrice: 5850, modalPrice: 5450, unit: 'Quintal', arrivals: 1600, msp: 6377, date: '2026-03-12' },
    { commodity: 'Groundnut', market: 'Cuddapah', state: 'Andhra Pradesh', district: 'YSR Kadapa', minPrice: 5080, maxPrice: 5880, modalPrice: 5480, unit: 'Quintal', arrivals: 1300, msp: 6377, date: '2026-03-12' },
    { commodity: 'Groundnut', market: 'Bikaner', state: 'Rajasthan', district: 'Bikaner', minPrice: 4900, maxPrice: 5700, modalPrice: 5300, unit: 'Quintal', arrivals: 900, msp: 6377, date: '2026-03-12' },

    // ── MAIZE ────────────────────────────────────────────────
    { commodity: 'Maize', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 2000, maxPrice: 2400, modalPrice: 2200, unit: 'Quintal', arrivals: 1800, msp: 2090, date: '2026-03-12' },
    { commodity: 'Maize', market: 'Dhule', state: 'Maharashtra', district: 'Dhule', minPrice: 1950, maxPrice: 2350, modalPrice: 2150, unit: 'Quintal', arrivals: 1200, msp: 2090, date: '2026-03-12' },
    { commodity: 'Maize', market: 'Warangal', state: 'Telangana', district: 'Warangal', minPrice: 2050, maxPrice: 2450, modalPrice: 2250, unit: 'Quintal', arrivals: 2200, msp: 2090, date: '2026-03-12' },
    { commodity: 'Maize', market: 'Gondia', state: 'Maharashtra', district: 'Gondia', minPrice: 1980, maxPrice: 2380, modalPrice: 2180, unit: 'Quintal', arrivals: 900, msp: 2090, date: '2026-03-12' },
    { commodity: 'Maize', market: 'Jashpur', state: 'Chhattisgarh', district: 'Jashpur', minPrice: 1920, maxPrice: 2320, modalPrice: 2120, unit: 'Quintal', arrivals: 700, msp: 2090, date: '2026-03-12' },
    { commodity: 'Maize', market: 'Muzaffarpur', state: 'Bihar', district: 'Muzaffarpur', minPrice: 1960, maxPrice: 2360, modalPrice: 2160, unit: 'Quintal', arrivals: 1400, msp: 2090, date: '2026-03-12' },

    // ── BANANA ───────────────────────────────────────────────
    { commodity: 'Banana', market: 'Jalgaon', state: 'Maharashtra', district: 'Jalgaon', minPrice: 1000, maxPrice: 2500, modalPrice: 1700, unit: 'Quintal', arrivals: 5000, msp: null, date: '2026-03-12' },
    { commodity: 'Banana', market: 'Anantapur', state: 'Andhra Pradesh', district: 'Anantapur', minPrice: 900, maxPrice: 2200, modalPrice: 1500, unit: 'Quintal', arrivals: 4200, msp: null, date: '2026-03-12' },
    { commodity: 'Banana', market: 'Trichy', state: 'Tamil Nadu', district: 'Tiruchirappalli', minPrice: 1100, maxPrice: 2600, modalPrice: 1800, unit: 'Quintal', arrivals: 3800, msp: null, date: '2026-03-12' },
    { commodity: 'Banana', market: 'Kozhikode', state: 'Kerala', district: 'Kozhikode', minPrice: 1200, maxPrice: 2800, modalPrice: 2000, unit: 'Quintal', arrivals: 2100, msp: null, date: '2026-03-12' },
    { commodity: 'Banana', market: 'Guwahati', state: 'Assam', district: 'Kamrup', minPrice: 800, maxPrice: 2100, modalPrice: 1450, unit: 'Quintal', arrivals: 1600, msp: null, date: '2026-03-12' },

    // ── MANGO ────────────────────────────────────────────────
    { commodity: 'Mango', market: 'Krishnagiri', state: 'Tamil Nadu', district: 'Krishnagiri', minPrice: 1500, maxPrice: 6000, modalPrice: 3500, unit: 'Quintal', arrivals: 4500, msp: null, date: '2026-03-12' },
    { commodity: 'Mango', market: 'Lucknow', state: 'Uttar Pradesh', district: 'Lucknow', minPrice: 2000, maxPrice: 8000, modalPrice: 4500, unit: 'Quintal', arrivals: 2800, msp: null, date: '2026-03-12' },
    { commodity: 'Mango', market: 'Ratnagiri', state: 'Maharashtra', district: 'Ratnagiri', minPrice: 3000, maxPrice: 12000, modalPrice: 7000, unit: 'Quintal', arrivals: 1500, msp: null, date: '2026-03-12' },
    { commodity: 'Mango', market: 'Hyderabad', state: 'Telangana', district: 'Hyderabad', minPrice: 1800, maxPrice: 7000, modalPrice: 4000, unit: 'Quintal', arrivals: 3200, msp: null, date: '2026-03-12' },

    // ── APPLE ────────────────────────────────────────────────
    { commodity: 'Apple', market: 'Shimla', state: 'Himachal Pradesh', district: 'Shimla', minPrice: 4000, maxPrice: 9000, modalPrice: 6500, unit: 'Quintal', arrivals: 3500, msp: null, date: '2026-03-12' },
    { commodity: 'Apple', market: 'Srinagar', state: 'Jammu & Kashmir', district: 'Srinagar', minPrice: 4500, maxPrice: 9500, modalPrice: 7000, unit: 'Quintal', arrivals: 5200, msp: null, date: '2026-03-12' },
    { commodity: 'Apple', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 5000, maxPrice: 10000, modalPrice: 7500, unit: 'Quintal', arrivals: 2800, msp: null, date: '2026-03-12' },
    { commodity: 'Apple', market: 'Gangtok', state: 'Sikkim', district: 'East Sikkim', minPrice: 4200, maxPrice: 9200, modalPrice: 6800, unit: 'Quintal', arrivals: 480, msp: null, date: '2026-03-12' },

    // ── SUGARCANE ────────────────────────────────────────────
    { commodity: 'Sugarcane', market: 'Muzaffarnagar', state: 'Uttar Pradesh', district: 'Muzaffarnagar', minPrice: 350, maxPrice: 400, modalPrice: 375, unit: 'Quintal', arrivals: 25000, msp: 340, date: '2026-03-12' },
    { commodity: 'Sugarcane', market: 'Kolhapur', state: 'Maharashtra', district: 'Kolhapur', minPrice: 335, maxPrice: 390, modalPrice: 360, unit: 'Quintal', arrivals: 18000, msp: 340, date: '2026-03-12' },
    { commodity: 'Sugarcane', market: 'Mandya', state: 'Karnataka', district: 'Mandya', minPrice: 330, maxPrice: 385, modalPrice: 355, unit: 'Quintal', arrivals: 12000, msp: 340, date: '2026-03-12' },

    // ── MOONG ────────────────────────────────────────────────
    { commodity: 'Moong', market: 'Jaipur', state: 'Rajasthan', district: 'Jaipur', minPrice: 6500, maxPrice: 7800, modalPrice: 7100, unit: 'Quintal', arrivals: 900, msp: 8682, date: '2026-03-12' },
    { commodity: 'Moong', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 6600, maxPrice: 7900, modalPrice: 7200, unit: 'Quintal', arrivals: 1100, msp: 8682, date: '2026-03-12' },
    { commodity: 'Moong', market: 'Warangal', state: 'Telangana', district: 'Warangal', minPrice: 6700, maxPrice: 8000, modalPrice: 7350, unit: 'Quintal', arrivals: 750, msp: 8682, date: '2026-03-12' },
    { commodity: 'Moong', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 6550, maxPrice: 7850, modalPrice: 7150, unit: 'Quintal', arrivals: 680, msp: 8682, date: '2026-03-12' },
];

function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

const getDynamicMarketData = () => {
    const today = new Date().toISOString().split('T')[0];
    return MARKET_DATA.map(item => {
        const seed = `${item.commodity}-${item.market}-${today}`;
        const randomFactor = seededRandom(seed);
        const fluctuationPercent = (randomFactor * 10) - 5;
        const newModalPrice = Math.round(item.modalPrice * (1 + (fluctuationPercent / 100)));
        const priceSpread = item.maxPrice - item.minPrice;
        return {
            ...item,
            date: today,
            modalPrice: newModalPrice,
            minPrice: Math.round(newModalPrice - (priceSpread * 0.4)),
            maxPrice: Math.round(newModalPrice + (priceSpread * 0.6)),
            arrivals: Math.round(item.arrivals * (0.8 + (seededRandom(seed + 'arr') * 0.4)))
        };
    });
};

// GET /api/enam/prices — prices with filters
router.get('/prices', (req, res) => {
    try {
        const { commodity, state, market } = req.query;
        const dynamicData = getDynamicMarketData();
        let filtered = [...dynamicData];
        if (commodity) filtered = filtered.filter(d => d.commodity.toLowerCase().includes(commodity.toLowerCase()));
        if (state) filtered = filtered.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));
        if (market) filtered = filtered.filter(d => d.market.toLowerCase().includes(market.toLowerCase()));

        const enriched = filtered.map(item => {
            const priceVsMsp = item.msp ? ((item.modalPrice - item.msp) / item.msp * 100).toFixed(1) : null;
            return {
                ...item,
                priceAnalysis: {
                    spreadPercentage: ((item.maxPrice - item.minPrice) / item.minPrice * 100).toFixed(1),
                    vsMSP: priceVsMsp ? `${priceVsMsp > 0 ? '+' : ''}${priceVsMsp}%` : 'N/A (No MSP)',
                    aboveMSP: item.msp ? item.modalPrice >= item.msp : null,
                    recommendation: getTradeRecommendation(item)
                }
            };
        });

        res.json({
            source: 'eNAM (National Agriculture Market) - Real-Time Simulation',
            isDemo: true,
            totalRecords: enriched.length,
            filters: { commodity: commodity || 'All', state: state || 'All', market: market || 'All' },
            data: enriched,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch market prices' });
    }
});

// GET /api/enam/by-crop/:commodity — prices for ONE crop across ALL states
router.get('/by-crop/:commodity', (req, res) => {
    try {
        const commodityName = decodeURIComponent(req.params.commodity);
        const dynamicData = getDynamicMarketData();
        const filtered = dynamicData.filter(d =>
            d.commodity.toLowerCase() === commodityName.toLowerCase()
        );

        const enriched = filtered.map(item => {
            const priceVsMsp = item.msp ? ((item.modalPrice - item.msp) / item.msp * 100).toFixed(1) : null;
            return {
                ...item,
                priceAnalysis: {
                    vsMSP: priceVsMsp ? `${priceVsMsp > 0 ? '+' : ''}${priceVsMsp}%` : 'N/A',
                    aboveMSP: item.msp ? item.modalPrice >= item.msp : null,
                    recommendation: getTradeRecommendation(item)
                }
            };
        });

        // Sort by state name
        enriched.sort((a, b) => a.state.localeCompare(b.state));

        res.json({
            commodity: commodityName,
            msp: filtered[0]?.msp || null,
            statesCount: new Set(filtered.map(d => d.state)).size,
            data: enriched,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch crop data' });
    }
});

// GET /api/enam/commodities
router.get('/commodities', (req, res) => {
    res.json({ source: 'eNAM', commodities: COMMODITIES, totalCommodities: COMMODITIES.length });
});

// GET /api/enam/markets/:state
router.get('/markets/:state', (req, res) => {
    const state = req.params.state.toLowerCase();
    const dynamicData = getDynamicMarketData();
    const markets = dynamicData
        .filter(d => d.state.toLowerCase().includes(state))
        .map(d => ({ market: d.market, district: d.district }));
    const unique = [...new Map(markets.map(m => [m.market, m])).values()];
    res.json({ source: 'eNAM', state: req.params.state, markets: unique, totalMarkets: unique.length });
});

// GET /api/enam/statistics
router.get('/statistics', (req, res) => {
    const dynamicData = getDynamicMarketData();
    const totalArrivals = dynamicData.reduce((sum, d) => sum + d.arrivals, 0);
    const commodityStats = {};
    dynamicData.forEach(d => {
        if (!commodityStats[d.commodity]) {
            commodityStats[d.commodity] = { totalArrivals: 0, avgPrice: 0, count: 0, markets: [] };
        }
        commodityStats[d.commodity].totalArrivals += d.arrivals;
        commodityStats[d.commodity].avgPrice += d.modalPrice;
        commodityStats[d.commodity].count += 1;
        commodityStats[d.commodity].markets.push(d.market);
    });
    Object.keys(commodityStats).forEach(k => {
        commodityStats[k].avgPrice = Math.round(commodityStats[k].avgPrice / commodityStats[k].count);
    });
    res.json({
        source: 'eNAM Simulation',
        overview: {
            totalMarketsTracked: new Set(dynamicData.map(d => d.market)).size,
            totalStatesTracked: new Set(dynamicData.map(d => d.state)).size,
            totalCommoditiesTraded: new Set(dynamicData.map(d => d.commodity)).size,
            totalArrivalsQuintals: totalArrivals
        },
        commodityWise: commodityStats,
        lastUpdated: new Date().toISOString()
    });
});

function getTradeRecommendation(item) {
    if (!item.msp) return 'Monitor market trends before selling.';
    if (item.modalPrice >= item.msp * 1.1) return '✅ Prices above MSP by 10%+. Good time to sell.';
    if (item.modalPrice >= item.msp) return '✅ Prices at or above MSP. Fair selling conditions.';
    if (item.modalPrice >= item.msp * 0.95) return '⚠️ Prices slightly below MSP. Consider government procurement.';
    return '🔴 Prices significantly below MSP. Sell through government procurement centres.';
}

module.exports = router;
