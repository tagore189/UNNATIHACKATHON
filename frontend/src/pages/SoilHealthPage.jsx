import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlaskConical, Search, Leaf, AlertTriangle, CheckCircle, Beaker } from 'lucide-react';
import { motion } from 'framer-motion';

const SoilHealthPage = () => {
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [soilData, setSoilData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/soil-health/');
                setStates(res.data.states);
            } catch (err) { console.error('Soil health states error', err); }
        };
        fetchStates();
    }, []);

    const handleFetchSoil = async () => {
        if (!selectedState || !selectedDistrict) return;
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:5000/api/soil-health/${selectedState}/${selectedDistrict}`);
            setSoilData(res.data);
        } catch (err) { console.error('Fetch soil error', err); }
        setLoading(false);
    };

    const getNPKColor = (rating) => rating === 'High' ? '#2e7d32' : rating === 'Medium' ? '#ff9800' : '#c62828';
    const getNPKBg = (rating) => rating === 'High' ? '#e8f5e9' : rating === 'Medium' ? '#fff3e0' : '#ffebee';

    const currentDistricts = states.find(s => s.id === selectedState)?.districts || [];

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FlaskConical size={40} color="#2e7d32" /> Soil Health Card
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '30px', fontSize: '1.1rem' }}>
                📋 Data sourced from <strong>Soil Health Card Scheme</strong> — Government of India
            </p>

            <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Select State</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                        value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedDistrict(''); setSoilData(null); }}>
                        <option value="">-- Choose State --</option>
                        {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Select District</label>
                    <select style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                        value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} disabled={!selectedState}>
                        <option value="">-- Choose District --</option>
                        {currentDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <button className="btn-primary" onClick={handleFetchSoil} disabled={!selectedState || !selectedDistrict || loading}
                    style={{ padding: '12px 30px', minWidth: '160px' }}>
                    {loading ? 'Loading...' : '🔍 Get Soil Data'}
                </button>
            </div>

            {soilData && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)' }}>
                        <h2 style={{ marginBottom: '10px' }}>{soilData.district}, {soilData.state}</h2>
                        <p style={{ color: '#555', fontSize: '1.1rem' }}>🌍 Soil Type: <strong>{soilData.soilType}</strong></p>
                    </div>

                    {/* NPK Levels */}
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Beaker size={24} color="#2e7d32" /> NPK Nutrient Levels
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        {['nitrogen', 'phosphorus', 'potassium'].map(nutrient => {
                            const data = soilData.npk[nutrient];
                            return (
                                <motion.div whileHover={{ scale: 1.02 }} key={nutrient} className="glass-card" style={{ padding: '25px', textAlign: 'center', borderLeft: `5px solid ${getNPKColor(data.rating)}` }}>
                                    <h4 style={{ textTransform: 'capitalize', color: '#333', marginBottom: '10px' }}>{nutrient}</h4>
                                    <div style={{ fontSize: '2.5rem', fontWeight: '800', color: getNPKColor(data.rating) }}>{data.value}</div>
                                    <p style={{ color: '#666', marginBottom: '10px' }}>{data.unit}</p>
                                    <span style={{ backgroundColor: getNPKBg(data.rating), color: getNPKColor(data.rating), padding: '5px 15px', borderRadius: '20px', fontWeight: '700', fontSize: '0.9rem' }}>{data.rating}</span>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* pH and Organic Carbon */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px' }}>Soil pH</h4>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1565c0' }}>{soilData.ph.value}</div>
                            <span style={{ backgroundColor: '#e3f2fd', color: '#1565c0', padding: '5px 15px', borderRadius: '20px', fontWeight: '700' }}>{soilData.ph.classification}</span>
                        </div>
                        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px' }}>Organic Carbon</h4>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: getNPKColor(soilData.organicCarbon.rating) }}>{soilData.organicCarbon.value}%</div>
                            <span style={{ backgroundColor: getNPKBg(soilData.organicCarbon.rating), color: getNPKColor(soilData.organicCarbon.rating), padding: '5px 15px', borderRadius: '20px', fontWeight: '700' }}>{soilData.organicCarbon.rating}</span>
                        </div>
                        <div className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                            <h4 style={{ marginBottom: '10px' }}>Electrical Conductivity</h4>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#6a1b9a' }}>{soilData.electricalConductivity.value}</div>
                            <p style={{ color: '#666' }}>{soilData.electricalConductivity.unit}</p>
                        </div>
                    </div>

                    {/* Deficiencies */}
                    {soilData.deficiencies.length > 0 && (
                        <div className="glass-card" style={{ padding: '25px', marginBottom: '25px', borderLeft: '5px solid #ff9800' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#e65100' }}>
                                <AlertTriangle size={24} color="#ff9800" /> Nutrient Deficiencies Detected
                            </h3>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {soilData.deficiencies.map((d, i) => (
                                    <span key={i} style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '8px 18px', borderRadius: '20px', fontWeight: '700' }}>⚠️ {d}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    <div className="glass-card" style={{ padding: '25px', borderLeft: '5px solid #2e7d32' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <CheckCircle size={24} color="#2e7d32" /> Fertilizer Recommendations
                        </h3>
                        <div style={{ display: 'grid', gap: '12px' }}>
                            {soilData.recommendations.map((rec, i) => (
                                <div key={i} style={{ backgroundColor: '#f1f8e9', padding: '15px 20px', borderRadius: '12px', color: '#1b5e20', fontWeight: '500' }}>
                                    {rec}
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}

            {!soilData && !loading && (
                <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                    <Leaf size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
                    <h3>Select a state and district to view soil health data</h3>
                    <p>Data includes NPK levels, pH, organic carbon, micronutrients, and fertilizer recommendations.</p>
                </div>
            )}
        </div>
    );
};

export default SoilHealthPage;
