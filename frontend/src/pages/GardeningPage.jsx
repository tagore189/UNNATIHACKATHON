import React, { useState } from 'react';
import { Leaf, UploadCloud, Loader2, ShieldCheck, Flower2, Droplets, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const GardeningPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');

    const tips = [
        { icon: <Droplets size={28} color="#1565c0" />, title: 'Watering', text: 'Most indoor plants need water only when the top inch of soil is dry. Overwatering is the #1 killer.' },
        { icon: <Sun size={28} color="#f9a825" />, title: 'Sunlight', text: 'Place plants near a bright window. Most need 6+ hours of indirect sunlight daily.' },
        { icon: <Leaf size={28} color="#2e7d32" />, title: 'Soil & Manure', text: 'Use organic compost or vermicompost every 2–3 months to replenish nutrients naturally.' },
        { icon: <Flower2 size={28} color="#c62828" />, title: 'Pruning', text: 'Trim dead leaves and stems to promote new growth and prevent disease spread.' },
    ];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) { setError('Please select an image first.'); return; }
        setIsLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('mode', 'gardening');
        try {
            const response = await axios.post('http://localhost:5000/api/analyze-plant', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success !== false) {
                setAnalysisResult(response.data);
            } else {
                setError(response.data.error || 'Analysis failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Make sure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Flower2 size={40} color="#2e7d32" /> Gardening Assistant
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '35px', fontSize: '1.1rem' }}>
                🌿 Upload a photo of your plant and get instant AI-powered care advice — for indoor or outdoor gardens.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
                {/* Upload Card */}
                <div className="glass-card" style={{ padding: '35px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>📷 Analyse Your Plant</h2>
                    <div
                        style={{
                            border: '2px dashed #a5d6a7', borderRadius: '15px', padding: '25px',
                            backgroundColor: '#f1f8e9', textAlign: 'center', position: 'relative', marginBottom: '20px', cursor: 'pointer'
                        }}
                    >
                        <input
                            type="file" accept="image/*" onChange={handleImageChange}
                            style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                        />
                        {previewUrl ? (
                            <div>
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '10px', marginBottom: '10px' }} />
                                <p style={{ color: '#2e7d32', fontWeight: '600', fontSize: '0.9rem' }}>✓ Image selected — click to change</p>
                            </div>
                        ) : (
                            <div>
                                <UploadCloud size={48} color="#a5d6a7" style={{ marginBottom: '12px' }} />
                                <p style={{ color: '#558b2f', fontWeight: '600' }}>Click or drag photo here</p>
                                <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '5px' }}>JPG, PNG, WEBP — max 10MB</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{ color: '#d32f2f', marginBottom: '15px', padding: '10px 15px', backgroundColor: '#ffebee', borderRadius: '8px', fontSize: '0.9rem' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        className="btn-primary"
                        onClick={handleAnalyze}
                        disabled={isLoading || !selectedImage}
                        style={{
                            width: '100%', padding: '14px', fontSize: '1rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            opacity: (isLoading || !selectedImage) ? 0.65 : 1,
                            cursor: (isLoading || !selectedImage) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? <><Loader2 className="animate-spin" size={22} /> Analysing with AI...</> : <><ShieldCheck size={22} /> Get Plant Care Advice</>}
                    </button>
                </div>

                {/* Quick Tips Card */}
                <div className="glass-card" style={{ padding: '35px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>🌱 Quick Gardening Tips</h2>
                    <div style={{ display: 'grid', gap: '18px' }}>
                        {tips.map((tip, i) => (
                            <motion.div key={i} whileHover={{ x: 4 }}
                                style={{ display: 'flex', alignItems: 'flex-start', gap: '15px', padding: '14px', backgroundColor: '#f9fbe7', borderRadius: '12px' }}>
                                <div style={{ flexShrink: 0, marginTop: '2px' }}>{tip.icon}</div>
                                <div>
                                    <p style={{ fontWeight: '700', color: '#1b5e20', marginBottom: '3px' }}>{tip.title}</p>
                                    <p style={{ color: '#555', fontSize: '0.88rem', lineHeight: '1.5' }}>{tip.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI Analysis Result */}
            {analysisResult && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '40px' }}
                >
                    <div className="glass-card" style={{ padding: '40px', borderLeft: '5px solid #2e7d32' }}>
                        <h3 style={{ color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                            <Leaf size={28} /> AI Plant Health Report
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                            <div>
                                <h4 style={{ marginBottom: '10px' }}>Current Condition</h4>
                                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1b5e20' }}>{analysisResult.condition}</p>

                                <h4 style={{ marginTop: '25px', marginBottom: '10px' }}>⚠️ Warnings</h4>
                                <p style={{ color: '#c62828', fontWeight: '600' }}>{analysisResult.warnings}</p>
                            </div>

                            <div>
                                <h4 style={{ marginBottom: '10px' }}>🛠️ Care Steps</h4>
                                <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                    {analysisResult.careSteps?.map((item, i) => <li key={i} style={{ marginBottom: '5px' }}>{item}</li>)}
                                </ul>

                                <div style={{ display: 'flex', gap: '30px', marginTop: '25px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}><Droplets size={16} /> Watering</h4>
                                        <p style={{ fontWeight: '600' }}>{analysisResult.watering}</p>
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}><Sun size={16} /> Sunlight</h4>
                                        <p style={{ fontWeight: '600' }}>{analysisResult.sunlight}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Info Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                {[
                    { emoji: '🪴', title: 'Indoor Plants', text: 'Peace Lily, Pothos, Snake Plant, Aloe Vera — great for Indian homes. Low maintenance, air-purifying.' },
                    { emoji: '🌸', title: 'Flowering Plants', text: 'Hibiscus, Jasmine, Marigold thrive in Indian climate. Water daily, fertilise bi-weekly.' },
                    { emoji: '🥬', title: 'Kitchen Garden', text: 'Grow Coriander, Methi, Tulsi, Green Chilli in pots. Fresh herbs for cooking, zero pesticides.' },
                ].map((card, i) => (
                    <div key={i} className="glass-card" style={{ padding: '25px' }}>
                        <p style={{ fontSize: '2rem', marginBottom: '10px' }}>{card.emoji}</p>
                        <h3 style={{ marginBottom: '8px' }}>{card.title}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>{card.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GardeningPage;
