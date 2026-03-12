import React from 'react';
import { ShieldAlert, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const PestAlertsPage = () => {
    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ShieldAlert size={40} color="#c62828" /> Pest Risk Alerts
            </h1>

            <div style={{ backgroundColor: '#ffebee', borderLeft: '6px solid #c62828', padding: '30px', borderRadius: '15px', marginBottom: '40px' }}>
                <h2 style={{ color: '#b71c1c', marginBottom: '15px' }}>High Risk: Locust Migration</h2>
                <p style={{ fontSize: '1.2rem', color: '#c62828' }}>
                    Satellite data suggests a potential swarm movement toward your district within 48 hours.
                </p>
                <button className="btn-primary" style={{ marginTop: '20px', backgroundColor: '#c62828' }}>
                    View Preventive Measures
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <Zap color="#ffb300" style={{ marginBottom: '15px' }} />
                    <h3>Daily Risk Index</h3>
                    <div style={{ height: '10px', backgroundColor: '#eee', borderRadius: '5px', margin: '15px 0' }}>
                        <div style={{ width: '75%', height: '100%', backgroundColor: '#f44336', borderRadius: '5px' }}></div>
                    </div>
                    <p>Score: **75/100 (High)**</p>
                </div>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <BookOpen color="#2e7d32" style={{ marginBottom: '15px' }} />
                    <h3>Recent Outbreaks</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Nearby farms reported aphid infestations in the last 24 hours.</p>
                </div>
            </div>
        </div>
    );
};

export default PestAlertsPage;
