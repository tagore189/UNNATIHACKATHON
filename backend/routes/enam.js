const express = require('express');
const router = express.Router();

// Realistic eNAM (National Agriculture Market) data
// Source format: https://enam.gov.in/web/
const COMMODITIES = [
    'Wheat', 'Rice (Paddy)', 'Maize', 'Bajra', 'Jowar',
    'Soybean', 'Groundnut', 'Mustard', 'Cotton', 'Sugarcane',
    'Onion', 'Potato', 'Tomato', 'Green Chilli', 'Turmeric',
    'Pigeon Pea (Tur)', 'Gram (Chana)', 'Moong', 'Urad', 'Masoor',
    'Banana', 'Mango', 'Apple', 'Orange', 'Pomegranate'
];

const MARKET_DATA = [
    // Wheat
    { commodity: 'Wheat', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 2100, maxPrice: 2450, modalPrice: 2275, unit: 'Quintal', arrivals: 1240, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Karnal', state: 'Haryana', district: 'Karnal', minPrice: 2200, maxPrice: 2500, modalPrice: 2350, unit: 'Quintal', arrivals: 3500, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Hathras', state: 'Uttar Pradesh', district: 'Hathras', minPrice: 2050, maxPrice: 2400, modalPrice: 2200, unit: 'Quintal', arrivals: 890, msp: 2275, date: '2026-03-12' },
    { commodity: 'Wheat', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 2150, maxPrice: 2480, modalPrice: 2300, unit: 'Quintal', arrivals: 2100, msp: 2275, date: '2026-03-12' },

    // Rice
    { commodity: 'Rice (Paddy)', market: 'Kurnool', state: 'Andhra Pradesh', district: 'Kurnool', minPrice: 1800, maxPrice: 2300, modalPrice: 2080, unit: 'Quintal', arrivals: 1800, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Burdwan', state: 'West Bengal', district: 'Purba Bardhaman', minPrice: 1950, maxPrice: 2400, modalPrice: 2150, unit: 'Quintal', arrivals: 2200, msp: 2203, date: '2026-03-12' },
    { commodity: 'Rice (Paddy)', market: 'Thanjavur', state: 'Tamil Nadu', district: 'Thanjavur', minPrice: 2000, maxPrice: 2350, modalPrice: 2175, unit: 'Quintal', arrivals: 1500, msp: 2203, date: '2026-03-12' },

    // Soybean
    { commodity: 'Soybean', market: 'Indore', state: 'Madhya Pradesh', district: 'Indore', minPrice: 4200, maxPrice: 4850, modalPrice: 4525, unit: 'Quintal', arrivals: 4200, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Nagpur', state: 'Maharashtra', district: 'Nagpur', minPrice: 4100, maxPrice: 4750, modalPrice: 4400, unit: 'Quintal', arrivals: 1800, msp: 4600, date: '2026-03-12' },
    { commodity: 'Soybean', market: 'Latur', state: 'Maharashtra', district: 'Latur', minPrice: 4250, maxPrice: 4900, modalPrice: 4600, unit: 'Quintal', arrivals: 2500, msp: 4600, date: '2026-03-12' },

    // Cotton
    { commodity: 'Cotton', market: 'Bathinda', state: 'Punjab', district: 'Bathinda', minPrice: 5500, maxPrice: 6300, modalPrice: 5900, unit: 'Quintal', arrivals: 950, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Guntur', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 5800, maxPrice: 6600, modalPrice: 6200, unit: 'Quintal', arrivals: 1200, msp: 7121, date: '2026-03-12' },
    { commodity: 'Cotton', market: 'Rajkot', state: 'Gujarat', district: 'Rajkot', minPrice: 5600, maxPrice: 6400, modalPrice: 6000, unit: 'Quintal', arrivals: 2800, msp: 7121, date: '2026-03-12' },

    // Onion
    { commodity: 'Onion', market: 'Lasalgaon', state: 'Maharashtra', district: 'Nashik', minPrice: 800, maxPrice: 1800, modalPrice: 1250, unit: 'Quintal', arrivals: 12000, msp: null, date: '2026-03-12' },
    { commodity: 'Onion', market: 'Azadpur', state: 'Delhi', district: 'New Delhi', minPrice: 1000, maxPrice: 2000, modalPrice: 1500, unit: 'Quintal', arrivals: 5500, msp: null, date: '2026-03-12' },

    // Tomato
    { commodity: 'Tomato', market: 'Kolar', state: 'Karnataka', district: 'Kolar', minPrice: 500, maxPrice: 1500, modalPrice: 900, unit: 'Quintal', arrivals: 8000, msp: null, date: '2026-03-12' },
    { commodity: 'Tomato', market: 'Madanapalle', state: 'Andhra Pradesh', district: 'Annamayya', minPrice: 600, maxPrice: 1600, modalPrice: 1050, unit: 'Quintal', arrivals: 6200, msp: null, date: '2026-03-12' },

    // Potato
    { commodity: 'Potato', market: 'Agra', state: 'Uttar Pradesh', district: 'Agra', minPrice: 400, maxPrice: 900, modalPrice: 650, unit: 'Quintal', arrivals: 9500, msp: null, date: '2026-03-12' },

    // Pigeon Pea
    { commodity: 'Pigeon Pea (Tur)', market: 'Gulbarga', state: 'Karnataka', district: 'Kalaburagi', minPrice: 6200, maxPrice: 7400, modalPrice: 6850, unit: 'Quintal', arrivals: 800, msp: 7000, date: '2026-03-12' },
    { commodity: 'Pigeon Pea (Tur)', market: 'Latur', state: 'Maharashtra', district: 'Latur', minPrice: 6400, maxPrice: 7600, modalPrice: 7050, unit: 'Quintal', arrivals: 1100, msp: 7000, date: '2026-03-12' },

    // Gram
    { commodity: 'Gram (Chana)', market: 'Bikaner', state: 'Rajasthan', district: 'Bikaner', minPrice: 4800, maxPrice: 5600, modalPrice: 5200, unit: 'Quintal', arrivals: 3200, msp: 5440, date: '2026-03-12' },
    { commodity: 'Gram (Chana)', market: 'Vidisha', state: 'Madhya Pradesh', district: 'Vidisha', minPrice: 4900, maxPrice: 5700, modalPrice: 5300, unit: 'Quintal', arrivals: 2800, msp: 5440, date: '2026-03-12' },

    // Mustard
    { commodity: 'Mustard', market: 'Alwar', state: 'Rajasthan', district: 'Alwar', minPrice: 4800, maxPrice: 5500, modalPrice: 5150, unit: 'Quintal', arrivals: 1500, msp: 5650, date: '2026-03-12' },

    // Turmeric
    { commodity: 'Turmeric', market: 'Erode', state: 'Tamil Nadu', district: 'Erode', minPrice: 8000, maxPrice: 14000, modalPrice: 11000, unit: 'Quintal', arrivals: 650, msp: null, date: '2026-03-12' },
    { commodity: 'Turmeric', market: 'Nizamabad', state: 'Telangana', district: 'Nizamabad', minPrice: 7500, maxPrice: 13500, modalPrice: 10500, unit: 'Quintal', arrivals: 900, msp: null, date: '2026-03-12' },

    // Groundnut
    { commodity: 'Groundnut', market: 'Junagadh', state: 'Gujarat', district: 'Junagadh', minPrice: 5000, maxPrice: 5800, modalPrice: 5400, unit: 'Quintal', arrivals: 1800, msp: 6377, date: '2026-03-12' },
];

// Generate consistent pseudo-random number based on a seed string
function seededRandom(seedStr) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
}

// Function to generate dynamic daily prices that look realistic
const getDynamicMarketData = () => {
    const today = new Date().toISOString().split('T')[0];
    
    return MARKET_DATA.map(item => {
        // Create a unique seed for this commodity/market/day combination
        const seed = `${item.commodity}-${item.market}-${today}`;
        const randomFactor = seededRandom(seed);
        
        // Fluctuation between -5% and +5% of base modal price
        const fluctuationPercent = (randomFactor * 10) - 5; 
        
        const newModalPrice = Math.round(item.modalPrice * (1 + (fluctuationPercent / 100)));
        const priceSpread = item.maxPrice - item.minPrice;
        
        return {
            ...item,
            date: today,
            modalPrice: newModalPrice,
            // Keep the spread roughly the same but shift min/max with modal
            minPrice: Math.round(newModalPrice - (priceSpread * 0.4)),
            maxPrice: Math.round(newModalPrice + (priceSpread * 0.6)),
            // Randomize arrivals a bit (-20% to +20%)
            arrivals: Math.round(item.arrivals * (0.8 + (seededRandom(seed + 'arr') * 0.4)))
        };
    });
};

// GET /api/enam/prices — Get mandi prices with filters
router.get('/prices', (req, res) => {
    try {
        const { commodity, state, market } = req.query;

        const dynamicData = getDynamicMarketData();
        let filtered = [...dynamicData];

        if (commodity) {
            filtered = filtered.filter(d => d.commodity.toLowerCase().includes(commodity.toLowerCase()));
        }
        if (state) {
            filtered = filtered.filter(d => d.state.toLowerCase().includes(state.toLowerCase()));
        }
        if (market) {
            filtered = filtered.filter(d => d.market.toLowerCase().includes(market.toLowerCase()));
        }

        // Add price analysis
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
            totalRecords: enriched.length,
            filters: { commodity: commodity || 'All', state: state || 'All', market: market || 'All' },
            data: enriched,
            lastUpdated: new Date().toISOString()
        });
    } catch (err) {
        console.error('eNAM Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch market prices' });
    }
});

// GET /api/enam/commodities — List all available commodities
router.get('/commodities', (req, res) => {
    res.json({
        source: 'eNAM',
        commodities: COMMODITIES,
        totalCommodities: COMMODITIES.length
    });
});

// GET /api/enam/markets/:state — Markets in a specific state
router.get('/markets/:state', (req, res) => {
    const state = req.params.state.toLowerCase();
    const dynamicData = getDynamicMarketData();
    const markets = dynamicData
        .filter(d => d.state.toLowerCase().includes(state))
        .map(d => ({ market: d.market, district: d.district }));

    const unique = [...new Map(markets.map(m => [m.market, m])).values()];

    res.json({
        source: 'eNAM',
        state: req.params.state,
        markets: unique,
        totalMarkets: unique.length
    });
});

// GET /api/enam/statistics — Overall trade statistics
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
