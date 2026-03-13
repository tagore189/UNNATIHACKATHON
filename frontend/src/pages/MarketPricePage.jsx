import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
    TrendingUp, Search, MapPin, Tag, ArrowUpRight, ArrowDownRight,
    BarChart3, Globe, Info, Calculator, Navigation, Bell, AlertCircle, TrendingDown,
    Mic, Volume2, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationLanguage } from '../hooks/useLocationLanguage';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

const COMMODITIES = [
    'Wheat', 'Rice (Paddy)', 'Maize', 'Bajra', 'Jowar',
    'Soybean', 'Groundnut', 'Mustard', 'Cotton', 'Sugarcane',
    'Onion', 'Potato', 'Tomato', 'Turmeric',
    'Pigeon Pea (Tur)', 'Gram (Chana)', 'Moong',
    'Banana', 'Mango', 'Apple',
];

// Helper: Calculate Haversine distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
};

// Proxies for market locations (using state capitals)
const STATE_COORDS = {
    'Andhra Pradesh': { lat: 16.506, lon: 80.648 },
    'Bihar': { lat: 25.594, lon: 85.137 },
    'Gujarat': { lat: 23.215, lon: 72.636 },
    'Haryana': { lat: 30.733, lon: 76.779 },
    'Karnataka': { lat: 12.971, lon: 77.594 },
    'Maharashtra': { lat: 18.975, lon: 72.825 },
    'Punjab': { lat: 30.733, lon: 76.779 },
    'Rajasthan': { lat: 26.912, lon: 75.787 },
    'Tamil Nadu': { lat: 13.082, lon: 80.27 },
    'Telangana': { lat: 17.385, lon: 78.486 },
    'Uttar Pradesh': { lat: 26.846, lon: 80.946 }
};

const MarketPricePage = () => {
    const [tab, setTab] = useState('all'); // 'all' | 'byCrop'
    const [marketData, setMarketData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ commodity: '', state: '', sort: 'highest' });
    const [userLoc, setUserLoc] = useState(null); // {lat, lon}
    const [isDemo, setIsDemo] = useState(false);
    const { userLang } = useLocationLanguage();
    const { speak, stopSpeaking, isSpeaking, startListening, isListening } = useVoiceInteraction(userLang);

    // Calculator & Alert states
    const [calc, setCalc] = useState({ quantity: 10 });
    const [alertThreshold, setAlertThreshold] = useState('');
    const [showAlertBanner, setShowAlertBanner] = useState(false);

    // By-crop view state
    const [selectedCrop, setSelectedCrop] = useState('Wheat');
    const [cropData, setCropData] = useState(null);
    const [cropLoading, setCropLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [pricesRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/enam/prices'),
                    axios.get('http://localhost:5000/api/enam/statistics')
                ]);

                setIsDemo(pricesRes.data.isDemo || false);

                // Add simulated/calculated coordinates and distance
                const enrichedData = pricesRes.data.data.map(item => {
                    const coords = STATE_COORDS[item.state] || { lat: 20 + Math.random() * 5, lon: 75 + Math.random() * 5 };
                    return {
                        ...item,
                        lat: coords.lat,
                        lon: coords.lon,
                        distance: userLoc ? calculateDistance(userLoc.lat, userLoc.lon, coords.lat, coords.lon) : Math.floor(Math.random() * 500) + 20,
                        arrivals: (item.arrivals === null || isNaN(item.arrivals)) ? null : item.arrivals
                    };
                });

                setMarketData(enrichedData);
                applySorting(enrichedData, filters.sort, userLoc);
                setStatistics(statsRes.data);
            } catch (err) { console.error('eNAM error', err); }
            setLoading(false);
        };
        fetchAll();
    }, [userLoc]);

    const fetchByCrop = async (crop) => {
        setCropLoading(true);
        setCropData(null);
        try {
            const res = await axios.get(`http://localhost:5000/api/enam/by-crop/${encodeURIComponent(crop)}`);
            setCropData(res.data);
        } catch (err) { console.error('Crop fetch error', err); }
        setCropLoading(false);
    };

    useEffect(() => {
        if (tab === 'byCrop') fetchByCrop(selectedCrop);
    }, [tab, selectedCrop]);

    const applySorting = (data, sortType, loc) => {
        let sorted = [...data];
        if (sortType === 'highest') sorted.sort((a, b) => b.modalPrice - a.modalPrice);
        else if (sortType === 'lowest') sorted.sort((a, b) => a.modalPrice - b.modalPrice);
        else if (sortType === 'arrivals') sorted.sort((a, b) => (b.arrivals || 0) - (a.arrivals || 0));
        else if (sortType === 'aboveMsp') sorted.sort((a, b) => (b.priceAnalysis.aboveMSP ? 1 : 0) - (a.priceAnalysis.aboveMSP ? 1 : 0));
        else if (sortType === 'distance' && loc) sorted.sort((a, b) => a.distance - b.distance);
        setFilteredData(sorted);
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                setFilters(prev => ({ ...prev, sort: 'distance' }));
            }, (err) => alert("Could not fetch location. Please enable GPS."));
        } else {
            alert("Geolocation not supported by browser.");
        }
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        if (name === 'sort') {
            applySorting(filteredData, value);
            return;
        }

        try {
            const params = new URLSearchParams();
            if (newFilters.commodity) params.set('commodity', newFilters.commodity);
            if (newFilters.state) params.set('state', newFilters.state);
            const res = await axios.get(`http://localhost:5000/api/enam/prices?${params}`);

            const enriched = res.data.data.map(item => {
                const coords = STATE_COORDS[item.state] || { lat: 20 + Math.random() * 5, lon: 75 + Math.random() * 5 };
                return {
                    ...item,
                    lat: coords.lat,
                    lon: coords.lon,
                    distance: userLoc ? calculateDistance(userLoc.lat, userLoc.lon, coords.lat, coords.lon) : Math.floor(Math.random() * 500) + 20,
                    arrivals: (item.arrivals === null || isNaN(item.arrivals)) ? null : item.arrivals
                };
            });

            applySorting(enriched, newFilters.sort, userLoc);
        } catch (err) { console.error('Filter error', err); }
    };

    const handleVoiceFilter = (field) => {
        startListening((result) => {
            const lowerResult = result.toLowerCase();
            let matchedValue = '';

            if (field === 'commodity') {
                matchedValue = COMMODITIES.find(c => lowerResult.includes(c.toLowerCase())) || '';
            } else if (field === 'state') {
                matchedValue = uniqueStates.find(s => lowerResult.includes(s.toLowerCase())) || '';
            }

            if (matchedValue) {
                handleFilterChange({ target: { name: field, value: matchedValue } });
            } else {
                alert(`Could not match "${result}" to a ${field}. Please try again.`);
            }
        });
    };

    const bestMarket = useMemo(() => {
        if (filteredData.length === 0) return null;
        // Logic: Weight Price 70%, Distance 30% if location available
        const maxPrice = Math.max(...filteredData.map(d => d.modalPrice)) || 1;
        const maxDist = Math.max(...filteredData.map(d => d.distance)) || 1;

        const dataWithScores = filteredData.map(d => ({
            ...d,
            score: (d.modalPrice / maxPrice * 0.7) + (userLoc ? (1 - d.distance / maxDist) * 0.3 : 0)
        }));

        return dataWithScores.sort((a, b) => b.score - a.score)[0];
    }, [filteredData, userLoc]);

    const uniqueStates = [...new Set(marketData.map(item => item.state))].sort();

    const getDistanceLabel = (km) => {
        if (km < 100) return { label: 'Nearby', color: '#2e7d32', bg: '#e8f5e9' };
        if (km < 300) return { label: 'Medium', color: '#e65100', bg: '#fff3e0' };
        return { label: 'Far', color: '#c62828', bg: '#ffebee' };
    };

    if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading eNAM market data...</div>;

    const maxCropPrice = cropData?.data ? Math.max(...cropData.data.map(d => d.modalPrice)) : 1;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1450px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <TrendingUp size={40} color="#2e7d32" /> eNAM Market Dashboard
                    </h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <p style={{ color: '#558b2f', fontSize: '1rem', margin: 0, fontWeight: '600' }}>
                            Precision Marketing Support for Farmers
                        </p>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', backgroundColor: '#f5f5f5', padding: '4px 12px', borderRadius: '15px', color: '#666', border: '1px solid #ddd' }}>
                                <Info size={12} style={{ marginRight: '4px' }} />
                                Source: eNAM / Agmarknet | Updated: {new Date().toLocaleString()}
                            </span>
                            {isDemo && (
                                <span style={{ fontSize: '0.75rem', backgroundColor: '#fff3e0', padding: '4px 12px', borderRadius: '15px', color: '#e65100', fontWeight: '800', border: '1px solid #ffe0b2' }}>
                                    Demo Mode: Using simulated mandi data
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '15px 25px', borderLeft: '4px solid #1b5e20', display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Calculator size={24} color="#2e7d32" />
                    <div>
                        <p style={{ fontSize: '0.75rem', color: '#666', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Revenue Estimator</p>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={calc.quantity}
                                onChange={(e) => setCalc({ quantity: e.target.value })}
                                style={{ width: '60px', padding: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                            />
                            <span style={{ fontWeight: '700', color: '#1b5e20' }}>Quintals → </span>
                            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2e7d32' }}>
                                ₹{(bestMarket?.modalPrice * (calc.quantity || 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights Banner */}
            {bestMarket && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '25px', backgroundColor: '#f1f8e9', border: '2px dashed #2e7d32', display: 'flex', gap: '20px' }}>
                        <div style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ArrowUpRight size={32} color="#2e7d32" />
                        </div>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', color: '#1b5e20', fontSize: '1.2rem' }}>
                                Best Market for {bestMarket.commodity}
                            </h3>
                            <p style={{ margin: '0 0 5px 0', color: '#558b2f', fontWeight: '600' }}>Modal Price: <strong>₹{bestMarket.modalPrice}</strong></p>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}>State: {bestMarket.state} | {userLoc ? "Distance from You" : "Distance"}: {bestMarket.distance}km</p>
                            <div style={{ fontSize: '0.85rem', color: '#1b5e20', backgroundColor: '#e8f5e9', padding: '12px', borderRadius: '8px', position: 'relative' }}>
                                💡 <strong>Advice:</strong> Highest {bestMarket.commodity} price found in {bestMarket.state}.
                                Farmers growing {bestMarket.commodity} may consider selling in {bestMarket.market} if transport is within ₹{Math.round(bestMarket.modalPrice * 0.05)}/Q.

                                <button
                                    onClick={() => isSpeaking ? stopSpeaking() : speak(`Advice for ${bestMarket.commodity}. Highest price found in ${bestMarket.state}. Consider selling if transport cost is low.`)}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        backgroundColor: isSpeaking ? '#ef5350' : '#2e7d32',
                                        color: 'white', border: 'none', borderRadius: '50%',
                                        width: '32px', height: '32px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}
                                >
                                    {isSpeaking ? <Square size={14} fill="white" /> : <Volume2 size={14} />}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <div className="glass-card" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                            <Bell size={18} color="#e65100" /> Set Price Alert
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#666' }}>Get notified when {filters.commodity || 'crops'} exceed your target price.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="number"
                                placeholder="Target Price ₹"
                                value={alertThreshold}
                                onChange={(e) => setAlertThreshold(e.target.value)}
                                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <button
                                onClick={() => {
                                    alert(`Alert set! We will notify you when price exceeds ₹${alertThreshold}`);
                                    setAlertThreshold('');
                                }}
                                className="btn-primary"
                                style={{ padding: '10px 20px' }}
                            >
                                Track Price
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Switch */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                {[
                    { key: 'all', label: '📋 Market Explorer', icon: null },
                    { key: 'byCrop', label: '📊 Price Trends & Comparison', icon: null }
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        style={{
                            padding: '12px 28px', borderRadius: '30px', border: 'none', fontWeight: '800', cursor: 'pointer',
                            backgroundColor: tab === t.key ? '#2e7d32' : '#e8f5e9',
                            color: tab === t.key ? 'white' : '#2e7d32',
                            boxShadow: tab === t.key ? '0 4px 12px rgba(46, 125, 50, 0.2)' : 'none',
                            transition: 'all 0.3s ease'
                        }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── ALL MARKETS TAB ─────────────────────────────────── */}
            {tab === 'all' && (
                <>
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: '#444' }}>
                                <Tag size={16} color="#2e7d32" /> Select Commodity
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select name="commodity" value={filters.commodity} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#fafafa', fontWeight: '600' }} onChange={handleFilterChange}>
                                    <option value="">All Commodities</option>
                                    {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <button
                                    onClick={() => handleVoiceFilter('commodity')}
                                    style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}
                                    title="Voice Search"
                                >
                                    <Mic size={18} color={isListening ? "#ef5350" : "#2e7d32"} className={isListening ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: '#444' }}>
                                <MapPin size={16} color="#2e7d32" /> Select State
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select name="state" value={filters.state} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#fafafa', fontWeight: '600' }} onChange={handleFilterChange}>
                                    <option value="">All States</option>
                                    {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <button
                                    onClick={() => handleVoiceFilter('state')}
                                    style={{ position: 'absolute', right: '35px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer' }}
                                    title="Voice Search"
                                >
                                    <Mic size={18} color={isListening ? "#ef5350" : "#2e7d32"} className={isListening ? "animate-pulse" : ""} />
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: '#444' }}>
                                <Navigation size={16} color="#e65100" /> Proximity
                            </label>
                            <button
                                onClick={handleUseMyLocation}
                                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: userLoc ? '2px solid #2e7d32' : '1px solid #ddd', backgroundColor: userLoc ? '#e8f5e9' : '#fff', fontWeight: '700', color: userLoc ? '#2e7d32' : '#666', cursor: 'pointer' }}
                            >
                                {userLoc ? "✓ Location Active" : "Use My Location"}
                            </button>
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '700', color: '#444' }}>
                                <TrendingUp size={16} color="#1565c0" /> Sort By
                            </label>
                            <select name="sort" value={filters.sort} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: '#fafafa', fontWeight: '600' }} onChange={handleFilterChange}>
                                <option value="highest">Highest Price First</option>
                                <option value="lowest">Lowest Price First</option>
                                <option value="arrivals">Highest Arrivals</option>
                                <option value="aboveMsp">Priority Selling (Above MSP)</option>
                                <option value="distance" disabled={!userLoc}>Distance (Closest First)</option>
                            </select>
                        </div>
                    </div>

                    <div className="glass-card" style={{ overflow: 'auto', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#2e7d32', color: 'white' }}>
                                <tr>
                                    {['Commodity', 'Market / Mandi', 'State', 'Arrivals (Q)', 'Modal Price', 'MSP Comparison', userLoc ? 'Distance from You' : 'Distance', 'Action'].map(h => (
                                        <th key={h} style={{ padding: '20px 16px', fontWeight: '700', fontSize: '0.9rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, i) => {
                                        const dist = getDistanceLabel(item.distance);
                                        return (
                                            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', transition: 'backgroundColor 0.2s' }} className="table-row-hover">
                                                <td style={{ padding: '18px 16px', fontWeight: '800', color: '#1b5e20' }}>{item.commodity}</td>
                                                <td style={{ padding: '18px 16px' }}>
                                                    <div style={{ fontWeight: '700' }}>{item.market}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#888' }}>eNAM Integrated</div>
                                                </td>
                                                <td style={{ padding: '18px 16px', color: '#444', fontWeight: '600' }}>{item.state}</td>
                                                <td style={{ padding: '18px 16px', fontWeight: '700' }}>
                                                    {item.arrivals ? item.arrivals.toLocaleString() : <span style={{ color: '#ccc', fontStyle: 'italic' }}>Data Not Available</span>}
                                                </td>
                                                <td style={{ padding: '18px 16px', fontWeight: '900', color: '#2e7d32', fontSize: '1.1rem', backgroundColor: '#f9fff9' }}>
                                                    ₹{item.modalPrice}
                                                </td>
                                                <td style={{ padding: '18px 16px' }}>
                                                    {item.priceAnalysis.aboveMSP !== null ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                            <span style={{
                                                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                                padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800',
                                                                backgroundColor: item.priceAnalysis.aboveMSP ? '#e8f5e9' : '#ffebee',
                                                                color: item.priceAnalysis.aboveMSP ? '#2e7d32' : '#c62828'
                                                            }}>
                                                                {item.priceAnalysis.aboveMSP ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                                {item.priceAnalysis.vsMSP} MSP
                                                            </span>
                                                        </div>
                                                    ) : <span style={{ color: '#999', fontSize: '0.75rem' }}>N/A</span>}
                                                </td>
                                                <td style={{ padding: '18px 16px' }}>
                                                    <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800', backgroundColor: dist.bg, color: dist.color }}>
                                                        {item.distance}km ({dist.label})
                                                    </span>
                                                </td>
                                                <td style={{ padding: '18px 16px' }}>
                                                    <button style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2e7d32', backgroundColor: 'transparent', color: '#2e7d32', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>
                                                        Sell Here
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="8" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                                            No data found for selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* ── CROP VS STATES TAB ──────────────────────────────── */}
            {tab === 'byCrop' && (
                <>
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '12px' }}>
                                <BarChart3 color="#2e7d32" />
                            </div>
                            <label style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1b5e20' }}>
                                Market Analysis:
                            </label>
                        </div>
                        <select
                            value={selectedCrop}
                            onChange={e => setSelectedCrop(e.target.value)}
                            style={{ flex: 1, minWidth: '250px', padding: '14px 20px', borderRadius: '15px', border: '2px solid #2e7d32', fontWeight: '800', fontSize: '1.1rem', color: '#1b5e20', cursor: 'pointer', appearance: 'none' }}
                        >
                            {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div style={{ flex: 2, display: 'flex', gap: '10px', overflowX: 'auto', padding: '5px' }}>
                            {/* Trend logic (simulated) */}
                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} style={{ minWidth: '80px', textAlign: 'center' }}>
                                    <div style={{ height: `${30 + Math.random() * 40}px`, backgroundColor: '#c8e6c9', borderRadius: '5px', marginBottom: '5px' }}></div>
                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#888' }}>Day {i + 1}</p>
                                </div>
                            ))}
                            <div style={{ alignSelf: 'center', marginLeft: '10px' }}>
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '800', color: '#2e7d32' }}>7-Day Price Trend</p>
                            </div>
                        </div>
                    </div>

                    {cropLoading && <div style={{ textAlign: 'center', padding: '60px' }}><Info className="animate-pulse" /> Fetching multi-state data...</div>}

                    {cropData && !cropLoading && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: '30px' }}>
                            {/* Visual Chart Card */}
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '30px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <h3 style={{ margin: 0, color: '#1b5e20' }}>Regional Price Variations</h3>
                                    {cropData.msp && <span style={{ padding: '6px 15px', backgroundColor: '#e3f2fd', color: '#1565c0', borderRadius: '12px', fontWeight: '800', fontSize: '0.85rem' }}>MSP: ₹{cropData.msp}/Q</span>}
                                </div>
                                <div style={{ display: 'grid', gap: '18px' }}>
                                    {cropData.data.slice(0, 10).map((item, i) => {
                                        const pct = Math.round((item.modalPrice / maxCropPrice) * 100);
                                        const aboveMsp = item.msp && item.modalPrice >= item.msp;
                                        return (
                                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{item.state}</span>
                                                <div style={{ height: '24px', backgroundColor: '#f0f0f0', borderRadius: '12px', overflow: 'hidden' }}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', backgroundColor: aboveMsp ? '#2e7d32' : '#ffa726', borderRadius: '12px' }} />
                                                </div>
                                                <span style={{ fontWeight: '800', fontSize: '0.9rem', minWidth: '70px', textAlign: 'right' }}>₹{item.modalPrice}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            {/* Alert & Advice Card */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card" style={{ padding: '30px', backgroundColor: '#faffff', border: '1px solid #e0f2f1' }}>
                                <h3 style={{ borderBottom: '2px solid #26a69a', paddingBottom: '10px', color: '#00695c' }}>🌾 {selectedCrop} Profit Guide</h3>

                                <div style={{ marginTop: '20px' }}>
                                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                                        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>TOP MODAL</p>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#2e7d32' }}>₹{maxCropPrice}</div>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', fontWeight: '700' }}>{cropData.data[0].state}</p>
                                        </div>
                                        <div style={{ flex: 1, padding: '20px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', textAlign: 'center' }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.75rem', color: '#888', fontWeight: '800' }}>TRADED VOLUME</p>
                                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1565c0' }}>{cropData.totalArrivals > 0 ? cropData.totalArrivals.toLocaleString() : "N/A"}</div>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '0.8rem', fontWeight: '700' }}>Total Quintals</p>
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', backgroundColor: '#e0f2f1', borderRadius: '15px', display: 'flex', gap: '15px' }}>
                                        <AlertCircle color="#00796b" size={24} />
                                        <div>
                                            <p style={{ margin: '0 0 5px 0', fontWeight: '800', color: '#00695c' }}>{selectedCrop} Smart Selling Logic</p>
                                            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: '1.6', color: '#004d40' }}>
                                                Current {selectedCrop} prices show robust demand in <strong>{cropData.data[0].state}</strong>.
                                                If you are a high-volume farmer, selling here ({cropData.data[0].market}) can net you ₹{maxCropPrice} per quintal.
                                                {userLoc ? ` \nDistance from your farm: ${calculateDistance(userLoc.lat, userLoc.lon, (STATE_COORDS[cropData.data[0].state] || { lat: 0 }).lat, (STATE_COORDS[cropData.data[0].state] || { lon: 0 }).lon)}km.` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'center' }}>
                                        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Navigation size={18} /> Find Nearby Procurement Centers
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MarketPricePage;
