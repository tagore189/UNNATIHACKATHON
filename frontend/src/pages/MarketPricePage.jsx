import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Search, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketPricePage = () => {
    const [marketData, setMarketData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ crop: '', state: '' });

    useEffect(() => {
        const fetchMarketPrices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/crops/market-prices');
                setMarketData(res.data);
                setFilteredData(res.data);
            } catch (err) {
                console.error('Market price error', err);
            }
            setLoading(false);
        };
        fetchMarketPrices();
    }, []);

    const handleFilterChange = (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);

        const filtered = marketData.filter(item => {
            return (newFilters.crop === '' || item.crop === newFilters.crop) &&
                (newFilters.state === '' || item.state === newFilters.state);
        });
        setFilteredData(filtered);
    };

    const uniqueCrops = [...new Set(marketData.map(item => item.crop))];
    const uniqueStates = [...new Set(marketData.map(item => item.state))];

    if (loading) return <div className="p-20 text-center">Loading market prices...</div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <TrendingUp size={40} color="#2e7d32" /> Market Price Tracker
            </h1>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '40px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600' }}>
                        <Tag size={18} /> Select Crop
                    </label>
                    <select
                        name="crop"
                        className="form-control"
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Crops</option>
                        {uniqueCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '250px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: '600' }}>
                        <MapPin size={18} /> Select State
                    </label>
                    <select
                        name="state"
                        className="form-control"
                        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                        onChange={handleFilterChange}
                    >
                        <option value="">All States</option>
                        {uniqueStates.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                </div>
            </div>

            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                        <tr>
                            <th style={{ padding: '20px' }}>Market</th>
                            <th style={{ padding: '20px' }}>State</th>
                            <th style={{ padding: '20px' }}>Crop</th>
                            <th style={{ padding: '20px' }}>Min Price (₹)</th>
                            <th style={{ padding: '20px' }}>Max Price (₹)</th>
                            <th style={{ padding: '20px' }}>Modal Price (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={i}
                                    style={{ borderBottom: '1px solid #eee' }}
                                >
                                    <td style={{ padding: '20px', fontWeight: '600' }}>{item.market}</td>
                                    <td style={{ padding: '20px' }}>{item.state}</td>
                                    <td style={{ padding: '20px' }}>{item.crop}</td>
                                    <td style={{ padding: '20px', color: '#c62828' }}>₹{item.minPrice}</td>
                                    <td style={{ padding: '20px', color: '#2e7d32' }}>₹{item.maxPrice}</td>
                                    <td style={{ padding: '20px', fontWeight: '800', backgroundColor: '#f1f8e9' }}>₹{item.modalPrice}</td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                    No data found for selected filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem', textAlign: 'right' }}>
                * Prices are updated as of today: {new Date().toLocaleDateString()}
            </p>
        </div>
    );
};

export default MarketPricePage;
