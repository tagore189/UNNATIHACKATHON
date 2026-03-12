import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, Droplets, Thermometer, AlertTriangle, CloudRain, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherPage = () => {
    const [weather, setWeather] = useState(null);
    const [imdData, setImdData] = useState(null);
    const [cycloneAlerts, setCycloneAlerts] = useState(null);
    const [selectedState, setSelectedState] = useState('maharashtra');
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/imd/states');
                setStates(res.data);
            } catch (err) { console.error('States error', err); }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [weatherRes, imdRes, cycloneRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/crops/weather/FarmerLocation'),
                    axios.get(`http://localhost:5000/api/imd/forecast/${selectedState}`),
                    axios.get('http://localhost:5000/api/imd/cyclone-alerts')
                ]);
                setWeather(weatherRes.data);
                setImdData(imdRes.data);
                setCycloneAlerts(cycloneRes.data);
            } catch (err) { console.error('Weather error', err); }
            setLoading(false);
        };
        fetchAll();
    }, [selectedState]);

    const getSeverityColor = (s) => s === 'RED' ? '#c62828' : s === 'ORANGE' ? '#e65100' : '#f9a825';
    const getSeverityBg = (s) => s === 'RED' ? '#ffebee' : s === 'ORANGE' ? '#fff3e0' : '#fffde7';
    const getRainColor = (mm) => mm > 50 ? '#1565c0' : mm > 20 ? '#42a5f5' : mm > 5 ? '#90caf9' : '#e3f2fd';

    if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading weather data...</div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CloudSun size={40} color="#2e7d32" /> Weather & IMD Forecast
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '30px', fontSize: '1.1rem' }}>
                🌦️ Data from <strong>India Meteorological Department (IMD)</strong> + Open-Meteo
            </p>

            {/* Current Weather Cards */}
            {weather && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                    <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                        <Thermometer size={40} color="#2e7d32" style={{ marginBottom: '10px' }} />
                        <h2 style={{ fontSize: '2.8rem', fontWeight: '800' }}>{Math.round(weather.temp)}°C</h2>
                        <p style={{ color: '#558b2f', fontWeight: '600' }}>Current Temperature</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                        <Droplets size={40} color="#2e7d32" style={{ marginBottom: '10px' }} />
                        <h2 style={{ fontSize: '2.8rem', fontWeight: '800' }}>{weather.humidity}%</h2>
                        <p style={{ color: '#558b2f', fontWeight: '600' }}>Humidity</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '25px', textAlign: 'center' }}>
                        <CloudRain size={40} color="#1565c0" style={{ marginBottom: '10px' }} />
                        <h2 style={{ fontSize: '2.8rem', fontWeight: '800' }}>{weather.rainfallProbability}%</h2>
                        <p style={{ color: '#558b2f', fontWeight: '600' }}>Rain Probability</p>
                    </motion.div>
                </div>
            )}

            {/* IMD 7-Day Forecast */}
            {imdData && (
                <section style={{ marginBottom: '35px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CloudRain size={24} color="#1565c0" /> IMD 7-Day Rainfall Forecast — {imdData.state}
                        </h3>
                        <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
                            style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #ddd', fontWeight: '600' }}>
                            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0' }}>
                            {imdData.forecast.map((day, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                                    style={{ padding: '20px 15px', textAlign: 'center', borderRight: i < 6 ? '1px solid #e0e0e0' : 'none' }}>
                                    <p style={{ fontWeight: '700', color: '#333', fontSize: '0.85rem', marginBottom: '10px' }}>
                                        {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                                    </p>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '12px', backgroundColor: getRainColor(day.rainfallMm), margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CloudRain size={22} color="#fff" />
                                    </div>
                                    <p style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1565c0' }}>{day.rainfallMm.toFixed(1)}mm</p>
                                    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px' }}>{day.rainProbability}% chance</p>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <span style={{ color: '#c62828', fontWeight: '700' }}>{Math.round(day.maxTemp)}°</span>
                                        <span style={{ color: '#999' }}> / </span>
                                        <span style={{ color: '#1565c0' }}>{Math.round(day.minTemp)}°</span>
                                    </div>
                                    <p style={{ fontSize: '0.7rem', color: '#888', marginTop: '5px' }}>{day.condition}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Farming Advisory */}
                    {imdData.advisory && imdData.advisory.length > 0 && (
                        <div className="glass-card" style={{ padding: '25px', marginTop: '20px', borderLeft: '5px solid #2e7d32' }}>
                            <h4 style={{ marginBottom: '15px', color: '#1b5e20' }}>🌾 Farming Advisory</h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {imdData.advisory.map((adv, i) => (
                                    <div key={i} style={{ backgroundColor: '#f1f8e9', padding: '12px 18px', borderRadius: '10px', color: '#1b5e20', fontWeight: '500' }}>{adv}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Cyclone / Extreme Weather Alerts */}
            {cycloneAlerts && cycloneAlerts.alerts.length > 0 && (
                <section>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <AlertTriangle size={24} color="#e65100" /> Active Extreme Weather Alerts
                    </h3>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {cycloneAlerts.alerts.map((alert, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                className="glass-card" style={{ padding: '25px', borderLeft: `5px solid ${getSeverityColor(alert.severity)}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                                    <h4 style={{ color: getSeverityColor(alert.severity), margin: 0 }}>{alert.title}</h4>
                                    <span style={{ backgroundColor: getSeverityBg(alert.severity), color: getSeverityColor(alert.severity), padding: '4px 14px', borderRadius: '20px', fontWeight: '800', fontSize: '0.8rem' }}>
                                        {alert.severity} ALERT
                                    </span>
                                </div>
                                <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.6' }}>{alert.description}</p>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' }}>
                                    {alert.affectedStates.map((s, j) => (
                                        <span key={j} style={{ backgroundColor: '#f5f5f5', padding: '4px 12px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: '600' }}>📍 {s}</span>
                                    ))}
                                </div>
                                {alert.advisoryForFarmers && (
                                    <div style={{ backgroundColor: getSeverityBg(alert.severity), padding: '15px', borderRadius: '12px' }}>
                                        <p style={{ fontWeight: '700', marginBottom: '10px', color: getSeverityColor(alert.severity) }}>🌾 Farmer Advisory:</p>
                                        <ul style={{ paddingLeft: '20px', color: '#333', lineHeight: '1.8' }}>
                                            {alert.advisoryForFarmers.map((a, j) => <li key={j}>{a}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default WeatherPage;
