import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CloudSun, Droplets, Thermometer, AlertTriangle, CloudRain, Wind, MapPin, Calendar, CheckCircle2, Info, Loader2, Gauge, Volume2, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationLanguage } from '../hooks/useLocationLanguage';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

const MAJOR_CITIES = [
    { id: 'hyderabad', name: 'Hyderabad', lat: 17.3850, lon: 78.4867 },
    { id: 'delhi', name: 'Delhi', lat: 28.7041, lon: 77.1025 },
    { id: 'mumbai', name: 'Mumbai', lat: 19.0760, lon: 72.8777 },
    { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { id: 'bangalore', name: 'Bangalore', lat: 12.9716, lon: 77.5946 },
    { id: 'kolkata', name: 'Kolkata', lat: 22.5726, lon: 88.3639 },
];

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [cycloneAlerts, setCycloneAlerts] = useState(null);
    const [selection, setSelection] = useState({ type: 'city', id: 'hyderabad' });
    const [loading, setLoading] = useState(true);
    const [states, setStates] = useState([]);
    const [error, setError] = useState(null);
    const { userLang } = useLocationLanguage();
    const { speak, stopSpeaking, isSpeaking } = useVoiceInteraction(userLang);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/imd/states');
                setStates(res.data);
            } catch (err) { console.error('States error', err); }
        };
        fetchStates();
    }, []);

    const fetchWeather = useCallback(async (lat, lon, stateId = 'maharashtra') => {
        setLoading(true);
        setError(null);
        try {
            const url = lat && lon
                ? `http://localhost:5000/api/imd/forecast/current?lat=${lat}&lon=${lon}`
                : `http://localhost:5000/api/imd/forecast/${stateId}`;

            const [weatherRes, cycloneRes] = await Promise.all([
                axios.get(url),
                axios.get('http://localhost:5000/api/imd/cyclone-alerts')
            ]);

            setWeatherData(weatherRes.data);
            setCycloneAlerts(cycloneRes.data);
        } catch (err) {
            console.error('Weather fetch error', err);
            setError('Failed to fetch weather data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (selection.type === 'gps') {
            navigator.geolocation.getCurrentPosition(
                (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
                (err) => {
                    console.error('GPS error', err);
                    setSelection({ type: 'city', id: 'hyderabad' });
                    fetchWeather(null, null, 'telangana');
                }
            );
        } else if (selection.type === 'city') {
            const city = MAJOR_CITIES.find(c => c.id === selection.id);
            fetchWeather(city.lat, city.lon);
        } else {
            fetchWeather(null, null, selection.id);
        }
    }, [selection, fetchWeather]);

    const handleSelectionChange = (e) => {
        const value = e.target.value;
        if (value === 'gps') setSelection({ type: 'gps', id: 'gps' });
        else if (MAJOR_CITIES.find(c => c.id === value)) setSelection({ type: 'city', id: value });
        else setSelection({ type: 'state', id: value });
    };

    const getRainColor = (mm) => mm > 50 ? '#1565c0' : mm > 20 ? '#42a5f5' : mm > 5 ? '#90caf9' : '#e3f2fd';
    const getFitnessColor = (fitness) => {
        switch (fitness) {
            case 'Excellent': return '#2e7d32';
            case 'Good': return '#66bb6a';
            case 'Fair': return '#ffa726';
            case 'Poor': return '#ef5350';
            default: return '#9e9e9e';
        }
    };

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <CloudSun size={40} color="#2e7d32" /> Smart Weather Advisory
                    </h1>
                    <p style={{ color: '#558b2f', fontSize: '1.1rem', margin: 0 }}>
                        📍 {weatherData?.state || 'Detecting Location...'}
                    </p>
                </div>

                <div className="glass-card" style={{ padding: '15px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <MapPin size={20} color="#2e7d32" />
                    <select
                        value={selection.type === 'gps' ? 'gps' : selection.id}
                        onChange={handleSelectionChange}
                        style={{ padding: '10px 15px', borderRadius: '10px', border: '1px solid #c8e6c9', backgroundColor: '#fff', fontWeight: '700', color: '#2e7d32', cursor: 'pointer' }}
                    >
                        <option value="gps">📡 Use My Current Location (GPS)</option>
                        <optgroup label="Major Cities">
                            {MAJOR_CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </optgroup>
                        <optgroup label="States">
                            {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </optgroup>
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '100px', textAlign: 'center' }}>
                    <Loader2 className="animate-spin" size={48} color="#2e7d32" style={{ margin: '0 auto 20px' }} />
                    <p style={{ fontWeight: '600', color: '#666' }}>Fetching real-time satellite & IMD data...</p>
                </div>
            ) : error ? (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center', border: '2px solid #ef5350' }}>
                    <AlertTriangle size={48} color="#ef5350" style={{ margin: '0 auto 20px' }} />
                    <p style={{ color: '#ef5350', fontWeight: '700' }}>{error}</p>
                    <button onClick={() => setSelection({ ...selection })} className="btn-primary" style={{ marginTop: '20px' }}>Retry Fetch</button>
                </div>
            ) : (
                <>
                    {/* Current Condition Header */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '35px' }}>
                        <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '15px' }}>
                                <Thermometer size={32} color="#2e7d32" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{Math.round(weatherData.current.temperature)}°C</h3>
                                <p style={{ color: '#666', fontWeight: '600' }}>Temperature</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '15px' }}>
                                <Droplets size={32} color="#1565c0" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{weatherData.current.humidity}%</h3>
                                <p style={{ color: '#666', fontWeight: '600' }}>Humidity</p>
                            </div>
                        </motion.div>

                        <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '15px' }}>
                                <Gauge size={32} color="#e65100" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '2.5rem', margin: 0 }}>{weatherData.current.precipitation}mm</h3>
                                <p style={{ color: '#666', fontWeight: '600' }}>Precipitation</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Farming Advisory Card */}
                    <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '30px', marginBottom: '35px', borderLeft: '8px solid #2e7d32', backgroundColor: '#fafff5' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                            <div>
                                <h2 style={{ color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '12px', margin: 0 }}>
                                    <CheckCircle2 color="#2e7d32" /> Farmer Action Plan
                                </h2>
                                <p style={{ color: '#558b2f', marginTop: '5px' }}>Personalized recommendations based on local moisture & temp</p>

                                <button
                                    onClick={() => isSpeaking ? stopSpeaking() : speak(`Farmer Action Plan. ${weatherData.advisory.join('. ')}`)}
                                    style={{
                                        marginTop: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '25px',
                                        border: 'none',
                                        backgroundColor: isSpeaking ? '#ef5350' : '#2e7d32',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    {isSpeaking ? <Square size={16} fill="white" /> : <Volume2 size={16} />}
                                    {isSpeaking ? 'Stop Listening' : 'Listen to Advice'}
                                </button>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '0.8rem', color: '#888', display: 'block' }}>Data Source: {weatherData.source}</span>
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Last Updated: {new Date(weatherData.generatedAt).toLocaleTimeString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
                            {weatherData.advisory.map((adv, i) => (
                                <div key={i} style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', border: '1px solid #e8f5e9', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                                    <p style={{ margin: 0, fontWeight: '500', color: '#2e7d32', lineHeight: '1.4' }}>{adv}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 7-Day Forecast with "Best Day" tagging */}
                    <section style={{ marginBottom: '35px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <Calendar size={24} color="#2e7d32" /> 7-Day Precision Forecast
                        </h3>
                        <div className="glass-card" style={{ overflowX: 'auto' }}>
                            <div style={{ display: 'flex', minWidth: '900px' }}>
                                {weatherData.forecast.map((day, i) => (
                                    <motion.div key={i} whileHover={{ backgroundColor: '#f5f5f5' }} style={{ flex: 1, padding: '25px 15px', textAlign: 'center', borderRight: i < 6 ? '1px solid #eee' : 'none', position: 'relative' }}>
                                        {/* Best Day Badge */}
                                        {day.advisory.fitness === 'Excellent' && (
                                            <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: '800', whiteSpace: 'nowrap', border: '1px solid #2e7d32' }}>
                                                🌟 BEST DAY
                                            </div>
                                        )}

                                        <p style={{ fontWeight: '700', color: '#555', fontSize: '0.9rem', marginBottom: '15px' }}>
                                            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                                        </p>

                                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: getRainColor(day.rainfallMm), margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CloudRain size={20} color="#fff" />
                                        </div>

                                        <h4 style={{ margin: '0 0 5px 0', fontSize: '1.3rem' }}>{day.rainfallMm.toFixed(1)}<span style={{ fontSize: '0.8rem' }}>mm</span></h4>
                                        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 10px 0' }}>{day.rainProbability}% Rain</p>

                                        <div style={{ marginBottom: '15px' }}>
                                            <span style={{ color: '#c62828', fontWeight: '800' }}>{Math.round(day.maxTemp)}°</span>
                                            <span style={{ color: '#999', margin: '0 4px' }}>/</span>
                                            <span style={{ color: '#1565c0' }}>{Math.round(day.minTemp)}°</span>
                                        </div>

                                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#f9f9f9', border: `1px solid ${getFitnessColor(day.advisory.fitness)}` }}>
                                            <p style={{ fontSize: '0.65rem', fontWeight: '800', color: '#999', textTransform: 'uppercase', margin: '0 0 2px 0' }}>Advice</p>
                                            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: getFitnessColor(day.advisory.fitness), margin: 0 }}>{day.advisory.activity}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Alerts Section (Extreme Weather) */}
                    {cycloneAlerts && cycloneAlerts.alerts.length > 0 && (
                        <AnimatePresence>
                            {cycloneAlerts.alerts.filter(a => a.severity !== 'GREEN').map((alert, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card"
                                    style={{ padding: '25px', marginBottom: '20px', borderLeft: '8px solid #ef5350', backgroundColor: '#fff9f9' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h3 style={{ color: '#c62828', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <AlertTriangle /> Extreme Weather Alert: {alert.title}
                                        </h3>
                                        <span style={{ backgroundColor: '#fee2e2', color: '#ef5350', padding: '5px 15px', borderRadius: '20px', fontWeight: '800', fontSize: '0.8rem' }}>
                                            {alert.severity} ALERT
                                        </span>
                                    </div>
                                    <p style={{ color: '#666', lineHeight: '1.6' }}>{alert.description}</p>
                                    <div style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '12px', border: '1px dashed #ef5350', marginTop: '15px' }}>
                                        <p style={{ fontWeight: '800', color: '#c62828', marginBottom: '8px' }}>🌾 Emergency Farming Advisory:</p>
                                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#333' }}>
                                            {alert.advisoryForFarmers.map((a, j) => <li key={j} style={{ marginBottom: '5px' }}>{a}</li>)}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </>
            )}
        </div>
    );
};

export default WeatherPage;
