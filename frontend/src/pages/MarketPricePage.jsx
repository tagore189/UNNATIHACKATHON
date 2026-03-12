import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Search, MapPin, Tag, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketPricePage = () => {
    const [marketData, setMarketData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ commodity: '', state: '' });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [pricesRes, commoditiesRes, statsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/enam/prices'),
                    axios.get('http://localhost:5000/api/enam/commodities'),
                    axios.get('http://localhost:5000/api/enam/statistics')
                ]);
                setMarketData(pricesRes.data.data);
                setFilteredData(pricesRes.data.data);
                setCommodities(commoditiesRes.data.commodities);
                setStatistics(statsRes.data);
            } catch (err) { console.error('eNAM error', err); }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const handleFilterChange = async (e) => {
        const newFilters = { ...filters, [e.target.name]: e.target.value };
        setFilters(newFilters);
        try {
            const params = new URLSearchParams();
            if (newFilters.commodity) params.set('commodity', newFilters.commodity);
            if (newFilters.state) params.set('state', newFilters.state);
            const res = await axios.get(`http://localhost:5000/api/enam/prices?${params}`);
            setFilteredData(res.data.data);
        } catch (err) { console.error('Filter error', err); }
    };

    const uniqueStates = [...new Set(marketData.map(item => item.state))];

    if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading eNAM market data...</div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <TrendingUp size={40} color="#2e7d32" /> eNAM Market Prices
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '30px', fontSize: '1.1rem' }}>
                📊 Live mandi prices from <strong>National Agriculture Market (eNAM)</strong>
            </p>

            {/* Statistics Overview */}
            {statistics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                    {[
                        { label: 'Markets Tracked', value: statistics.overview.totalMarketsTracked, icon: <MapPin size={22} color="#2e7d32" /> },
                        { label: 'States Covered', value: statistics.overview.totalStatesTracked, icon: <BarChart3 size={22} color="#1565c0" /> },
                        { label: 'Commodities', value: statistics.overview.totalCommoditiesTraded, icon: <Tag size={22} color="#e65100" /> },
                        { label: 'Total Arrivals (Q)', value: statistics.overview.totalArrivalsQuintals.toLocaleString(), icon: <TrendingUp size={22} color="#6a1b9a" /> }
                    ].map((stat, i) => (
                        <motion.div whileHover={{ scale: 1.03 }} key={i} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '8px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#1b5e20' }}>{stat.value}</div>
                            <p style={{ color: '#666', fontSize: '0.85rem', fontWeight: '600' }}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Filters */}
            <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                        <Tag size={18} /> Select Commodity
                    </label>
                    <select name="commodity" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={handleFilterChange}>
                        <option value="">All Commodities</option>
                        {commodities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                        <MapPin size={18} /> Select State
                    </label>
                    <select name="state" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={handleFilterChange}>
                        <option value="">All States</option>
                        {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Price Table */}
            <div className="glass-card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                        <tr>
                            <th style={{ padding: '18px' }}>Commodity</th>
                            <th style={{ padding: '18px' }}>Market</th>
                            <th style={{ padding: '18px' }}>State</th>
                            <th style={{ padding: '18px' }}>Min ₹</th>
                            <th style={{ padding: '18px' }}>Max ₹</th>
                            <th style={{ padding: '18px' }}>Modal ₹</th>
                            <th style={{ padding: '18px' }}>MSP ₹</th>
                            <th style={{ padding: '18px' }}>vs MSP</th>
                            <th style={{ padding: '18px' }}>Recommendation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((item, i) => (
                            <motion.tr key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '16px', fontWeight: '700' }}>{item.commodity}</td>
                                <td style={{ padding: '16px' }}>{item.market}</td>
                                <td style={{ padding: '16px', color: '#555' }}>{item.state}</td>
                                <td style={{ padding: '16px', color: '#c62828' }}>₹{item.minPrice}</td>
                                <td style={{ padding: '16px', color: '#2e7d32' }}>₹{item.maxPrice}</td>
                                <td style={{ padding: '16px', fontWeight: '800', backgroundColor: '#f1f8e9' }}>₹{item.modalPrice}</td>
                                <td style={{ padding: '16px', color: '#1565c0', fontWeight: '600' }}>
                                    {item.msp ? `₹${item.msp}` : '—'}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    {item.priceAnalysis.aboveMSP !== null ? (
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: '700',
                                            backgroundColor: item.priceAnalysis.aboveMSP ? '#e8f5e9' : '#ffebee',
                                            color: item.priceAnalysis.aboveMSP ? '#2e7d32' : '#c62828'
                                        }}>
                                            {item.priceAnalysis.aboveMSP ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                            {item.priceAnalysis.vsMSP}
                                        </span>
                                    ) : <span style={{ color: '#999', fontSize: '0.8rem' }}>N/A</span>}
                                </td>
                                <td style={{ padding: '16px', fontSize: '0.8rem', maxWidth: '200px' }}>{item.priceAnalysis.recommendation}</td>
                            </motion.tr>
                        )) : (
                            <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No data found for selected filters.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p style={{ marginTop: '15px', color: '#666', fontSize: '0.85rem', textAlign: 'right' }}>
                * Source: eNAM (National Agriculture Market) | Updated: {new Date().toLocaleDateString('en-IN')} | MSP = Minimum Support Price
            </p>
        </div>
    );
};

export default MarketPricePage;
