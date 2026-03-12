import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, Wind, Droplets, Thermometer, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const WeatherPage = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/crops/weather/FarmerLocation');
                setWeather(res.data);
            } catch (err) {
                console.error('Weather error', err);
            }
        };
        fetchWeather();
    }, []);

    if (!weather) return <div className="p-20 text-center">Loading detailed weather...</div>;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CloudSun size={40} color="#2e7d32" /> Detailed Weather Forecast
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <Thermometer size={48} color="#2e7d32" style={{ marginBottom: '15px' }} />
                    <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>{Math.round(weather.temp)}°C</h2>
                    <p style={{ color: '#558b2f', fontWeight: '600' }}>Current Temperature</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <Droplets size={48} color="#2e7d32" style={{ marginBottom: '15px' }} />
                    <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>{weather.humidity}%</h2>
                    <p style={{ color: '#558b2f', fontWeight: '600' }}>Relative Humidity</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>🌦️</div>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800' }}>{weather.rainfallProbability}%</h2>
                    <p style={{ color: '#558b2f', fontWeight: '600' }}>Rain Probability</p>
                </motion.div>
            </div>

            <section style={{ marginTop: '40px' }} className="glass-card">
                <div style={{ padding: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <AlertTriangle color="#ff9800" /> Farmer Specific Alerts
                    </h3>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {weather.alerts.map((alert, i) => (
                            <div key={i} style={{ backgroundColor: '#fff3e0', borderLeft: '5px solid #ff9800', padding: '20px', borderRadius: '12px' }}>
                                <p style={{ color: '#e65100', fontSize: '1.1rem', fontWeight: '500' }}>{alert}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WeatherPage;
