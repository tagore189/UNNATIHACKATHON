import { Sprout, CloudSun, Lightbulb, Bug, Droplets, ShieldAlert, TrendingUp, FlaskConical, Satellite, Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user')) || { fullName: 'Farmer' };
    const navigate = useNavigate();

    const modules = [
        {
            title: 'IMD Weather & Alerts',
            icon: <CloudSun color="#2e7d32" size={32} />,
            path: '/weather',
            desc: 'IMD 7-day rainfall forecast, temperature data, cyclone alerts and farming advisories.',
            metric: 'IMD Live',
            badge: '🌦️'
        },
        {
            title: 'eNAM Market Prices',
            icon: <TrendingUp color="#2e7d32" size={32} />,
            path: '/market-prices',
            desc: 'Live mandi prices from National Agriculture Market with MSP comparison and trade advice.',
            metric: 'eNAM Live',
            badge: '📊'
        },
        {
            title: 'Soil Health Card',
            icon: <FlaskConical color="#6a1b9a" size={32} />,
            path: '/soil-health',
            desc: 'NPK levels, soil pH, organic carbon, micronutrients and fertilizer recommendations.',
            metric: 'Gov. Data',
            badge: '🧪'
        },
        {
            title: 'ISRO Bhuvan Maps',
            icon: <Satellite color="#1565c0" size={32} />,
            path: '/satellite-map',
            desc: 'ISRO satellite imagery — NDVI, land use, soil moisture, and crop health layers.',
            metric: 'Satellite',
            badge: '🛰️'
        },
        {
            title: 'Language Translation',
            icon: <Languages color="#e65100" size={32} />,
            path: '/language-tool',
            desc: 'AI4Bharat powered translation across 13 Indian languages with farming phrases.',
            metric: '13 Languages',
            badge: '🗣️'
        },
        {
            title: 'Crop Recommendation',
            icon: <Sprout color="#2e7d32" size={32} />,
            path: '/crop-advisor',
            desc: 'Personalized crop suggestions based on your soil type, season, and location.',
            metric: '3 Matches',
            badge: '🌱'
        },
        {
            title: 'Disease Detection',
            icon: <Bug color="#c62828" size={32} />,
            path: '/disease-detection',
            desc: 'AI-powered crop disease identification and organic treatment recommendations.',
            metric: 'Scanner Ready',
            badge: '🔬'
        },
        {
            title: 'Irrigation Advice',
            icon: <Droplets color="#0277bd" size={32} />,
            path: '/irrigation',
            desc: 'Smart watering schedules based on soil moisture and evapotranspiration data.',
            metric: '32% Moisture',
            badge: '💧'
        },
        {
            title: 'Pest Risk Alerts',
            icon: <ShieldAlert color="#ff9800" size={32} />,
            path: '/pest-alerts',
            desc: 'Local pest outbreak notifications and preventive measures for your area.',
            metric: 'Alert Active',
            badge: '🛡️'
        }
    ];

    return (
        <div className="fade-in" style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Hello, {user.fullName}!</h1>
                <p style={{ color: '#558b2f', fontSize: '1.2rem' }}>Welcome to your farming command center — powered by IMD, ISRO Bhuvan, eNAM & AI4Bharat.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
                {modules.map((mod, i) => (
                    <motion.div
                        whileHover={{ translateY: -8, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
                        key={i}
                        className="glass-card"
                        style={{ padding: '28px', display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                            <div style={{ padding: '12px', backgroundColor: '#e8f5e9', borderRadius: '15px' }}>
                                {mod.icon}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', backgroundColor: '#f1f8e9', padding: '5px 12px', borderRadius: '20px', color: '#2e7d32' }}>
                                {mod.metric}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{mod.badge} {mod.title}</h3>
                        <p style={{ color: '#666', fontSize: '0.92rem', marginBottom: '22px', flexGrow: 1 }}>{mod.desc}</p>
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
                <div className="glass-card" style={{ padding: '40px', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
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
