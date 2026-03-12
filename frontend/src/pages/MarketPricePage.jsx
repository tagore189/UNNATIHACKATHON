import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Search, MapPin, Tag, ArrowUpRight, ArrowDownRight, BarChart3, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const COMMODITIES = [
    'Wheat', 'Rice (Paddy)', 'Maize', 'Bajra', 'Jowar',
    'Soybean', 'Groundnut', 'Mustard', 'Cotton', 'Sugarcane',
    'Onion', 'Potato', 'Tomato', 'Turmeric',
    'Pigeon Pea (Tur)', 'Gram (Chana)', 'Moong',
    'Banana', 'Mango', 'Apple',
];

const MarketPricePage = () => {
    const [tab, setTab] = useState('all'); // 'all' | 'byCrop'
    const [marketData, setMarketData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ commodity: '', state: '' });

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
                setMarketData(pricesRes.data.data);
                setFilteredData(pricesRes.data.data);
                setStatistics(statsRes.data);
            } catch (err) { console.error('eNAM error', err); }
            setLoading(false);
        };
        fetchAll();
    }, []);

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

    const uniqueStates = [...new Set(marketData.map(item => item.state))].sort();

    if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading eNAM market data...</div>;

    const maxCropPrice = cropData?.data ? Math.max(...cropData.data.map(d => d.modalPrice)) : 1;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <TrendingUp size={40} color="#2e7d32" /> eNAM Market Prices
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '25px', fontSize: '1.1rem' }}>
                📊 Live mandi prices from <strong>National Agriculture Market (eNAM)</strong> — all 28 Indian states
            </p>

            {/* Statistics */}
            {statistics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                    {[
                        { label: 'Markets Tracked', value: statistics.overview.totalMarketsTracked, icon: <MapPin size={22} color="#2e7d32" /> },
                        { label: 'States Covered', value: statistics.overview.totalStatesTracked, icon: <Globe size={22} color="#1565c0" /> },
                        { label: 'Commodities', value: statistics.overview.totalCommoditiesTraded, icon: <Tag size={22} color="#e65100" /> },
                        { label: 'Total Arrivals (Q)', value: statistics.overview.totalArrivalsQuintals.toLocaleString(), icon: <BarChart3 size={22} color="#6a1b9a" /> }
                    ].map((stat, i) => (
                        <motion.div whileHover={{ scale: 1.03 }} key={i} className="glass-card" style={{ padding: '18px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '6px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#1b5e20' }}>{stat.value}</div>
                            <p style={{ color: '#666', fontSize: '0.82rem', fontWeight: '600' }}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Tab Switch */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '25px' }}>
                {[
                    { key: 'all', label: '📋 All Markets', icon: null },
                    { key: 'byCrop', label: '🌾 Crop vs All States', icon: null }
                ].map(t => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        style={{
                            padding: '11px 24px', borderRadius: '25px', border: 'none', fontWeight: '700', cursor: 'pointer',
                            backgroundColor: tab === t.key ? '#2e7d32' : '#e8f5e9',
                            color: tab === t.key ? 'white' : '#2e7d32',
                            transition: 'all 0.25s ease'
                        }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ── ALL MARKETS TAB ─────────────────────────────────── */}
            {tab === 'all' && (
                <>
                    <div className="glass-card" style={{ padding: '22px', marginBottom: '25px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                                <Tag size={16} /> Commodity
                            </label>
                            <select name="commodity" style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={handleFilterChange}>
                                <option value="">All Commodities</option>
                                {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                                <MapPin size={16} /> State
                            </label>
                            <select name="state" style={{ width: '100%', padding: '11px', borderRadius: '10px', border: '1px solid #ddd' }} onChange={handleFilterChange}>
                                <option value="">All States</option>
                                {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="glass-card" style={{ overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                                <tr>
                                    {['Commodity', 'Market', 'State', 'Min ₹', 'Max ₹', 'Modal ₹', 'MSP ₹', 'vs MSP', 'Recommendation'].map(h => (
                                        <th key={h} style={{ padding: '16px', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? filteredData.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #eee', opacity: 0, animation: `fadeInRow 0.3s ease forwards ${Math.min(i, 20) * 0.02}s` }}>
                                        <td style={{ padding: '14px', fontWeight: '700' }}>{item.commodity}</td>
                                        <td style={{ padding: '14px' }}>{item.market}</td>
                                        <td style={{ padding: '14px', color: '#555' }}>{item.state}</td>
                                        <td style={{ padding: '14px', color: '#c62828' }}>₹{item.minPrice}</td>
                                        <td style={{ padding: '14px', color: '#2e7d32' }}>₹{item.maxPrice}</td>
                                        <td style={{ padding: '14px', fontWeight: '800', backgroundColor: '#f1f8e9' }}>₹{item.modalPrice}</td>
                                        <td style={{ padding: '14px', color: '#1565c0', fontWeight: '600' }}>{item.msp ? `₹${item.msp}` : '—'}</td>
                                        <td style={{ padding: '14px' }}>
                                            {item.priceAnalysis.aboveMSP !== null ? (
                                                <span style={{
                                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                    padding: '4px 10px', borderRadius: '15px', fontSize: '0.78rem', fontWeight: '700',
                                                    backgroundColor: item.priceAnalysis.aboveMSP ? '#e8f5e9' : '#ffebee',
                                                    color: item.priceAnalysis.aboveMSP ? '#2e7d32' : '#c62828'
                                                }}>
                                                    {item.priceAnalysis.aboveMSP ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                                    {item.priceAnalysis.vsMSP}
                                                </span>
                                            ) : <span style={{ color: '#999', fontSize: '0.78rem' }}>N/A</span>}
                                        </td>
                                        <td style={{ padding: '14px', fontSize: '0.78rem', maxWidth: '200px' }}>{item.priceAnalysis.recommendation}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="9" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No data found for selected filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <p style={{ marginTop: '12px', color: '#888', fontSize: '0.82rem', textAlign: 'right' }}>
                        * Source: eNAM | Updated: {new Date().toLocaleDateString('en-IN')} | MSP = Minimum Support Price (2025-26)
                    </p>
                </>
            )}

            {/* ── CROP VS STATES TAB ──────────────────────────────── */}
            {tab === 'byCrop' && (
                <>
                    <div className="glass-card" style={{ padding: '22px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                        <label style={{ fontWeight: '700', fontSize: '1rem', color: '#1b5e20', whiteSpace: 'nowrap' }}>
                            🌾 Select Crop:
                        </label>
                        <select
                            value={selectedCrop}
                            onChange={e => setSelectedCrop(e.target.value)}
                            style={{ padding: '12px 18px', borderRadius: '12px', border: '2px solid #2e7d32', fontWeight: '700', fontSize: '1rem', color: '#1b5e20', backgroundColor: '#f1f8e9', cursor: 'pointer' }}
                        >
                            {COMMODITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {cropData && (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <span style={{ padding: '8px 18px', backgroundColor: '#e8f5e9', borderRadius: '20px', fontWeight: '700', color: '#2e7d32', fontSize: '0.9rem' }}>
                                    {cropData.statesCount} States
                                </span>
                                {cropData.msp && (
                                    <span style={{ padding: '8px 18px', backgroundColor: '#e3f2fd', borderRadius: '20px', fontWeight: '700', color: '#1565c0', fontSize: '0.9rem' }}>
                                        MSP: ₹{cropData.msp}/Q
                                    </span>
                                )}
                                <span style={{ padding: '8px 18px', backgroundColor: '#fff3e0', borderRadius: '20px', fontWeight: '700', color: '#e65100', fontSize: '0.9rem' }}>
                                    Live {new Date().toLocaleDateString('en-IN')}
                                </span>
                            </div>
                        )}
                    </div>

                    {cropLoading && <div style={{ textAlign: 'center', padding: '60px', color: '#558b2f', fontSize: '1.1rem' }}>Fetching prices across all states...</div>}

                    {cropData && !cropLoading && (
                        <>
                            {/* Bar chart-style grid */}
                            <div className="glass-card" style={{ padding: '30px', marginBottom: '25px' }}>
                                <h3 style={{ marginBottom: '25px', color: '#1b5e20' }}>
                                    Modal Price of <strong>{selectedCrop}</strong> across All States (₹/Quintal)
                                </h3>
                                <div style={{ display: 'grid', gap: '14px' }}>
                                    {cropData.data.map((item, i) => {
                                        const pct = Math.round((item.modalPrice / maxCropPrice) * 100);
                                        const aboveMsp = item.msp && item.modalPrice >= item.msp;
                                        const barColor = aboveMsp ? '#2e7d32' : item.msp ? '#e65100' : '#1565c0';
                                        return (
                                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                                style={{ display: 'grid', gridTemplateColumns: '180px 1fr auto', alignItems: 'center', gap: '14px' }}>
                                                <div>
                                                    <p style={{ fontWeight: '700', fontSize: '0.92rem', color: '#1b5e20', marginBottom: '2px' }}>{item.state}</p>
                                                    <p style={{ fontSize: '0.78rem', color: '#888' }}>{item.market}</p>
                                                </div>
                                                <div style={{ position: 'relative', height: '32px', backgroundColor: '#f5f5f5', borderRadius: '8px', overflow: 'hidden' }}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.6, delay: i * 0.04 }}
                                                        style={{ height: '100%', backgroundColor: barColor, borderRadius: '8px', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}
                                                    >
                                                        <span style={{ color: 'white', fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                                            ₹{item.modalPrice.toLocaleString()}
                                                        </span>
                                                    </motion.div>
                                                </div>
                                                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                                                    {item.msp ? (
                                                        <span style={{
                                                            fontSize: '0.78rem', fontWeight: '700', padding: '4px 10px', borderRadius: '12px',
                                                            backgroundColor: aboveMsp ? '#e8f5e9' : '#fff3e0',
                                                            color: aboveMsp ? '#2e7d32' : '#e65100'
                                                        }}>
                                                            {item.priceAnalysis.vsMSP}
                                                        </span>
                                                    ) : <span style={{ color: '#aaa', fontSize: '0.78rem' }}>No MSP</span>}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                                {cropData.msp && (
                                    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '15px', borderTop: '1px solid #eee' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#2e7d32', display: 'inline-block' }}></span> Above MSP
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#e65100', display: 'inline-block' }}></span> Below MSP
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600' }}>
                                            <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#1565c0', display: 'inline-block' }}></span> No MSP set
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Summary table */}
                            <div className="glass-card" style={{ overflow: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                                        <tr>
                                            {['State', 'Market', 'Min ₹', 'Modal ₹', 'Max ₹', 'Arrivals (Q)', 'vs MSP'].map(h => (
                                                <th key={h} style={{ padding: '14px', whiteSpace: 'nowrap' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cropData.data.map((item, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                                <td style={{ padding: '13px', fontWeight: '700' }}>{item.state}</td>
                                                <td style={{ padding: '13px', color: '#555' }}>{item.market}</td>
                                                <td style={{ padding: '13px', color: '#c62828' }}>₹{item.minPrice}</td>
                                                <td style={{ padding: '13px', fontWeight: '800', backgroundColor: '#f1f8e9' }}>₹{item.modalPrice}</td>
                                                <td style={{ padding: '13px', color: '#2e7d32' }}>₹{item.maxPrice}</td>
                                                <td style={{ padding: '13px' }}>{item.arrivals.toLocaleString()}</td>
                                                <td style={{ padding: '13px' }}>
                                                    {item.priceAnalysis.aboveMSP !== null ? (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '3px',
                                                            padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700',
                                                            backgroundColor: item.priceAnalysis.aboveMSP ? '#e8f5e9' : '#fff3e0',
                                                            color: item.priceAnalysis.aboveMSP ? '#2e7d32' : '#e65100'
                                                        }}>
                                                            {item.priceAnalysis.aboveMSP ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                                                            {item.priceAnalysis.vsMSP}
                                                        </span>
                                                    ) : <span style={{ color: '#aaa' }}>—</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default MarketPricePage;
