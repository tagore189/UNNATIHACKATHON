import React from 'react';
import { Lightbulb, Leaf, Recycle, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const SustainabilityPage = () => {
    const tips = [
        {
            icon: <Leaf color="#2e7d32" />,
            title: "Crop Rotation",
            desc: "Alternating crops helps break pest cycles and replenish soil nitrogen naturally."
        },
        {
            icon: <Recycle color="#558b2f" />,
            title: "Composting",
            desc: "Convert organic farm waste into nutrient-rich fertilizer to reduce chemical dependency."
        },
        {
            icon: <Sun color="#ffb300" />,
            title: "Solar Irrigation",
            desc: "Using solar-powered pumps reduces carbon footprint and lowers energy costs."
        },
        {
            icon: <Lightbulb color="#accent" />,
            title: "Precision Farming",
            desc: "Apply water and nutrients exactly where needed using sensor data to minimize waste."
        }
    ];

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Lightbulb size={40} color="#ffb300" /> Sustainability Hub
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#558b2f', marginBottom: '40px', maxWidth: '800px' }}>
                Sustainable farming protects the environment while ensuring long-term profitability and food security. Explore our curated guides below.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
                {tips.map((tip, i) => (
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        key={i}
                        className="glass-card"
                        style={{ padding: '30px', display: 'flex', gap: '20px' }}
                    >
                        <div style={{ padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '15px', height: 'fit-content' }}>
                            {tip.icon}
                        </div>
                        <div>
                            <h3 style={{ marginBottom: '10px' }}>{tip.title}</h3>
                            <p style={{ color: '#666' }}>{tip.desc}</p>
                            <button style={{ marginTop: '15px', background: 'none', border: 'none', color: '#2e7d32', fontWeight: '700', cursor: 'pointer' }}>
                                Read More &rarr;
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SustainabilityPage;
