import React from 'react';
import { Droplets, ThermometerSun, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const IrrigationPage = () => {
    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Droplets size={40} color="#0277bd" /> Irrigation Advice
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                <motion.div whileHover={{ translateY: -5 }} className="glass-card" style={{ padding: '30px', borderTop: '6px solid #0277bd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <Waves color="#0277bd" size={32} />
                        <h3>Soil Moisture</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>32%</div>
                    <p style={{ color: '#546e7a' }}>Status: **Low Moisture**</p>
                    <div style={{ marginTop: '20px', height: '8px', backgroundColor: '#e1f5fe', borderRadius: '4px' }}>
                        <div style={{ width: '32%', height: '100%', backgroundColor: '#0277bd', borderRadius: '4px' }}></div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ translateY: -5 }} className="glass-card" style={{ padding: '30px', borderTop: '6px solid #f57c00' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                        <ThermometerSun color="#f57c00" size={32} />
                        <h3>Evapotranspiration</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '10px' }}>5.2 mm/day</div>
                    <p style={{ color: '#546e7a' }}>Estimated water loss today.</p>
                </motion.div>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Personalized Irrigation Schedule</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#e1f5fe', borderRadius: '12px' }}>
                        <strong>Next Irrigation:</strong>
                        <span style={{ color: '#01579b', fontWeight: '700' }}>Tomorrow, 06:00 AM</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', backgroundColor: '#f1f8e9', borderRadius: '12px' }}>
                        <strong>Recommended Depth:</strong>
                        <span style={{ color: '#2e7d32', fontWeight: '700' }}>15 mm</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IrrigationPage;
