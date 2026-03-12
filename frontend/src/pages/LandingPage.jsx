import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CloudSun, ShieldCheck, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <nav style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sprout size={32} color="#2e7d32" />
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#1b5e20' }}>AgriGuard</h2>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Go to Dashboard</Link>
                </div>
            </nav>

            <header style={{ textAlign: 'center', padding: '100px 20px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '4rem', marginBottom: '20px', lineHeight: '1.2' }}
                >
                    Climate-Smart Farming <br />
                    <span style={{ color: '#4caf50' }}>for a Greener Future</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: '1.2rem', color: '#558b2f', maxWidth: '700px', margin: '0 auto 40px' }}
                >
                    Empowering farmers with real-time weather alerts and AI-driven crop recommendations to ensure sustainable and high-yield harvests.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.2rem', padding: '15px 40px', textDecoration: 'none' }}>Start Your Journey</Link>
                </motion.div>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', padding: '50px' }}>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <CloudSun size={48} color="#2e7d32" style={{ marginBottom: '20px' }} />
                    <h3>Weather Intelligence</h3>
                    <p>Receive precise weather alerts tailored to your farm's location.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <ShieldCheck size={48} color="#2e7d32" style={{ marginBottom: '20px' }} />
                    <h3>Crop Recommendations</h3>
                    <p>Smart algorithms to suggest the best crops for your soil and season.</p>
                </div>
                <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
                    <Leaf size={48} color="#2e7d32" style={{ marginBottom: '20px' }} />
                    <h3>Sustainable Practices</h3>
                    <p>Insights into eco-friendly farming to protect your land for generations.</p>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
