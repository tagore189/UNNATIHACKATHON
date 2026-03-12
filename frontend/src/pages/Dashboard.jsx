import { Sprout, CloudSun, Lightbulb, LogOut, Bug, Droplets, ShieldAlert, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Farmer' };
    const navigate = useNavigate();

    const modules = [
        {
            title: 'Weather Alerts',
            icon: <CloudSun color="#2e7d32" size={32} />,
            path: '/weather',
            desc: 'Real-time temperature, rain probability and farmer-specific weather advice.',
            metric: '24°C - Clear'
        },
        {
            title: 'Crop Recommendation',
            icon: <Sprout color="#2e7d32" size={32} />,
            path: '/crop-advisor',
            desc: 'Personalized crop suggestions based on your soil type, season, and location.',
            metric: '3 Matches'
        },
        {
            title: 'Market Prices',
            icon: <TrendingUp color="#2e7d32" size={32} />,
            path: '/market-prices',
            desc: 'Track real-time crop prices across different markets and regions.',
            metric: 'Live Prices'
        },
        {
            title: 'Disease Detection',
            icon: <Bug color="#c62828" size={32} />,
            path: '/disease-detection',
            desc: 'Use AI to identify crop diseases and get organic control treatments instantly.',
            metric: 'Scanner Ready'
        },
        {
            title: 'Irrigation Advice',
            icon: <Droplets color="#0277bd" size={32} />,
            path: '/irrigation',
            desc: 'Smart watering schedules based on soil moisture and evapotranspiration data.',
            metric: '32% Moisture'
        },
        {
            title: 'Pest Risk Alerts',
            icon: <ShieldAlert color="#ff9800" size={32} />,
            path: '/pest-alerts',
            desc: 'Get notified about local pest outbreaks and preventive measures in your area.',
            metric: 'High Risk Alert'
        }
    ];

    return (
        <div className="fade-in" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Hello, {user.fullName}!</h1>
                <p style={{ color: '#558b2f', fontSize: '1.2rem' }}>Welcome to your farming command center.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                {modules.map((mod, i) => (
                    <motion.div
                        whileHover={{ translateY: -8, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                        key={i}
                        className="glass-card"
                        style={{ padding: '30px', display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '15px' }}>
                                {mod.icon}
                            </div>
                            <span style={{ fontSize: '0.85rem', fontWeight: '800', backgroundColor: '#f1f8e9', padding: '5px 12px', borderRadius: '20px', color: '#2e7d32' }}>
                                {mod.metric}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>{mod.title}</h3>
                        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '25px', flexGrow: 1 }}>{mod.desc}</p>
                        <button
                            onClick={() => navigate(mod.path)}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: 'auto' }}
                        >
                            Explore Module
                        </button>
                    </motion.div>
                ))}
            </div>

            <section style={{ marginTop: '50px' }}>
                <div className="glass-card" style={{ padding: '40px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: 'white', marginBottom: '10px' }}>Ready to optimize your farm?</h2>
                        <p style={{ opacity: 0.9 }}>Check our latest sustainability tips for a better harvest.</p>
                    </div>
                    <button
                        onClick={() => navigate('/sustainability')}
                        style={{ backgroundColor: 'white', color: 'var(--primary)', border: 'none', padding: '15px 30px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}
                    >
                        View More Tips
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
