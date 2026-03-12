import React from 'react';
import { Bug, Camera, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const DiseaseDetectionPage = () => {
    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Bug size={40} color="#2e7d32" /> AI Disease Detection
            </h1>

            <div className="glass-card" style={{ padding: '60px', textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: '#e8f5e9', width: '120px', height: '120px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
                        <Camera size={60} color="#2e7d32" />
                    </div>
                    <h2>Snap a Photo of Your Crop</h2>
                    <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                        Our AI will analyze the leaves and stem to identify potential pests or diseases instantly.
                    </p>
                    <button className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem' }}>
                        Upload Image
                    </button>
                    <p style={{ marginTop: '15px', fontSize: '0.85rem', color: '#999' }}>Supports JPG, PNG up to 10MB</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <ShieldCheck color="#2e7d32" style={{ marginBottom: '15px' }} />
                    <h3>Common Diseases</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Learn about Blast, Blight, and Rust to take early preventive measures.</p>
                </div>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <Bug color="#c62828" style={{ marginBottom: '15px' }} />
                    <h3>Pest Database</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>Comprehensive guide on identifying and controlling major crop pests.</p>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetectionPage;
