import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, CloudSun, Sprout, Bug, Droplets,
    ShieldAlert, TrendingUp, Lightbulb,
    FlaskConical, Satellite, Languages, Flower2
} from 'lucide-react';
import { useLocationLanguage } from '../hooks/useLocationLanguage';

const Navbar = () => {
    const location = useLocation();
    const { userLang, changeLanguage } = useLocationLanguage();

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        changeLanguage(lang);
    };

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/weather', label: 'Weather', icon: <CloudSun size={20} /> },
        { path: '/crop-advisor', label: 'Crops', icon: <Sprout size={20} /> },
        { path: '/market-prices', label: 'eNAM Prices', icon: <TrendingUp size={20} /> },
        { path: '/soil-health', label: 'Soil Health', icon: <FlaskConical size={20} /> },
        { path: '/satellite-map', label: 'Bhuvan Maps', icon: <Satellite size={20} /> },
        { path: '/language-tool', label: 'Language', icon: <Languages size={20} /> },
        { path: '/disease-detection', label: 'Disease', icon: <Bug size={20} /> },
        { path: '/irrigation', label: 'Irrigation', icon: <Droplets size={20} /> },
        { path: '/pest-alerts', label: 'Pest Alerts', icon: <ShieldAlert size={20} /> },
        { path: '/gardening', label: 'Gardening', icon: <Flower2 size={20} /> },
        { path: '/sustainability', label: 'Tips', icon: <Lightbulb size={20} /> },
    ];

    return (
        <nav className="navbar notranslate">
            <div className="nav-container">
                <div className="nav-brand">
                    <Sprout color="#2e7d32" size={28} />
                    <span className="brand-text">AgriGuard</span>
                </div>
                <div className="nav-links">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="language-container">
                    <div id="google_translate_element"></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2e7d32', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        <Languages size={18} />
                        <select
                            className="language-selector notranslate"
                            value={userLang}
                            onChange={handleLanguageChange}
                            style={{
                                padding: '6px 10px',
                                borderRadius: '8px',
                                border: '1px solid #c8e6c9',
                                backgroundColor: '#f1f8e9',
                                color: '#2e7d32',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="en">English (Default)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                            <option value="ml">മലയാളം (Malayalam)</option>
                            <option value="or">ଓଡ଼ିଆ (Odia)</option>
                        </select>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
