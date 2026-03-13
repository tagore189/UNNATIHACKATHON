import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, CloudSun, ShieldCheck, Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
    return (
        <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={{ padding: '2rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Sprout size={32} color="var(--primary)" />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.04em' }}>
                        AgriGuard.
                    </h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" className="btn-secondary" style={{ textDecoration: 'none' }}>Log In</Link>
                    <Link to="/dashboard" className="btn-primary" style={{ textDecoration: 'none' }}>Start Journey</Link>
                </div>
            </nav>

            <header style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: '900', letterSpacing: '-0.05em', lineHeight: '1.05', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                        Farming, <br/>
                        <span style={{ color: 'var(--primary)' }}>Refined.</span>
                    </h1>
                </motion.div>
                
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}
                >
                    A minimalist approach to climate-smart agriculture. Precise weather intelligence, AI-driven crop diagnostics, and sustainable insights—without the clutter.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <Link to="/dashboard" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '16px 40px', textDecoration: 'none' }}>
                        Enter Dashboard <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </header>

            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', padding: '2rem 4rem 6rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--text-main)' }}>
                    <CloudSun size={36} color="var(--text-main)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Surgical Weather</h3>
                    <p style={{ fontSize: '1rem' }}>No noise, just data. Precise local alerts mapped directly to your coordinates.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--primary)' }}>
                    <ShieldCheck size={36} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>AI Diagnostics</h3>
                    <p style={{ fontSize: '1rem' }}>Instantly identify crop anomalies relying on pure, unadulterated vision models.</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-card" style={{ padding: '3rem 2rem', borderTop: '4px solid var(--accent)' }}>
                    <Leaf size={36} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Clean Ecology</h3>
                    <p style={{ fontSize: '1rem' }}>Clear, actionable insights into sustainable farming to protect your yield.</p>
                </motion.div>
            </section>
        </div>
    );
};

export default LandingPage;
