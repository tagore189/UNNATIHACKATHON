import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, Search, Info, Mic, Volume2, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

const CropAdvisorPage = () => {
    const [soilData, setSoilData] = useState({ soilType: 'Loamy', season: 'Summer', location: '' });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentLang: userLang } = useLanguage();
    const { speak, stopSpeaking, isSpeaking, startListening, isListening } = useVoiceInteraction(userLang);

    const handleRecommend = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/crops/recommend', soilData);
            setRecommendations(res.data);
        } catch (err) {
            console.error('Recommendation fetch error', err);
        }
        setLoading(false);
    };

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Sprout size={40} color="#2e7d32" /> Smart Crop Advisor
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
                <aside className="glass-card" style={{ padding: '30px', height: 'fit-content' }}>
                    <h3 style={{ marginBottom: '20px' }}>Input Parameters</h3>
                    <form onSubmit={handleRecommend} style={{ display: 'grid', gap: '20px' }}>
                        <div style={{ display: 'grid', gap: '8px', position: 'relative' }}>
                            <label style={{ fontWeight: '600' }}>Region / Location</label>
                            <input
                                type="text"
                                value={soilData.location}
                                placeholder="e.g. Tropical, Arid"
                                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', paddingRight: '45px' }}
                                onChange={(e) => setSoilData({ ...soilData, location: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => startListening((res) => setSoilData(prev => ({ ...prev, location: res })))}
                                style={{
                                    position: 'absolute', right: '10px', bottom: '8px',
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    color: isListening ? '#ef5350' : '#2e7d32'
                                }}
                            >
                                <Mic size={20} className={isListening ? 'animate-pulse' : ''} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontWeight: '600' }}>Soil Type</label>
                            <select
                                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                onChange={(e) => setSoilData({ ...soilData, soilType: e.target.value })}
                            >
                                <option>Loamy</option>
                                <option>Clayey</option>
                                <option>Sandy</option>
                                <option>Silty</option>
                                <option>Black Soil</option>
                            </select>
                        </div>
                        <div style={{ display: 'grid', gap: '8px' }}>
                            <label style={{ fontWeight: '600' }}>Season</label>
                            <select
                                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd' }}
                                onChange={(e) => setSoilData({ ...soilData, season: e.target.value })}
                            >
                                <option>Summer</option>
                                <option>Winter</option>
                                <option>Monsoon</option>
                                <option>Spring</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Analyzing...' : 'Get Best Crops'}
                        </button>
                    </form>
                </aside>

                <main>
                    {recommendations.length > 0 ? (
                        <div style={{ display: 'grid', gap: '25px' }}>
                            {recommendations.map((crop, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i}
                                    className="glass-card"
                                    style={{ padding: '25px' }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <h2 style={{ color: '#2e7d32' }}>{crop.name}</h2>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                💧 {crop.waterRequirement} Water
                                            </span>
                                            <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                🕒 {crop.growingPeriod}
                                            </span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '1.1rem', color: '#444', marginBottom: '20px' }}>{crop.description}</p>
                                    <div style={{ backgroundColor: '#f1f8e9', padding: '15px', borderRadius: '12px', position: 'relative' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#1b5e20' }}>
                                            <Info size={18} /> Expert Growing Tips:
                                        </h4>
                                        <ul style={{ paddingLeft: '20px', color: '#2e7d32', marginBottom: 0 }}>
                                            {crop.tips.map((tip, j) => (
                                                <li key={j} style={{ marginBottom: '5px' }}>{tip}</li>
                                            ))}
                                        </ul>
                                        <button
                                            onClick={() => {
                                                if (isSpeaking) stopSpeaking();
                                                else {
                                                    const text = `${crop.name}. ${crop.description}. Expert tips: ${crop.tips.join('. ')}`;
                                                    speak(text);
                                                }
                                            }}
                                            style={{
                                                position: 'absolute', top: '15px', right: '15px',
                                                backgroundColor: isSpeaking ? '#ef5350' : '#2e7d32',
                                                color: 'white', border: 'none', borderRadius: '50%',
                                                width: '32px', height: '32px', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                            }}
                                        >
                                            {isSpeaking ? <Square size={14} fill="white" /> : <Volume2 size={14} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
                            <Search size={64} style={{ marginBottom: '20px', opacity: 0.3 }} />
                            <h3>No recommendations yet.</h3>
                            <p>Select your soil and season to see the best crops for your farm.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CropAdvisorPage;
