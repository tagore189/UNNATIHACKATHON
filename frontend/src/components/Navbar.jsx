import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, CloudSun, Sprout, Bug, Droplets,
    TrendingUp, Lightbulb,
    FlaskConical, Satellite, Languages, Flower2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
    const location = useLocation();
    const { currentLang, changeLanguage, t } = useLanguage();

    const handleLanguageChange = (e) => {
        changeLanguage(e.target.value);
    };

    const navLinks = [
        { path: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard size={20} /> },
        { path: '/weather', label: t('weather'), icon: <CloudSun size={20} /> },
        { path: '/crop-advisor', label: t('crops'), icon: <Sprout size={20} /> },
        { path: '/market-prices', label: t('enam_prices'), icon: <TrendingUp size={20} /> },
        { path: '/soil-health', label: t('soil_health'), icon: <FlaskConical size={20} /> },
        { path: '/satellite-map', label: t('bhuvan_maps'), icon: <Satellite size={20} /> },
        { path: '/language-tool', label: t('language'), icon: <Languages size={20} /> },
        { path: '/disease-detection', label: t('disease'), icon: <Bug size={20} /> },
        { path: '/irrigation', label: t('irrigation'), icon: <Droplets size={20} /> },
        { path: '/gardening', label: t('gardening'), icon: <Flower2 size={20} /> },
        { path: '/sustainability', label: t('tips'), icon: <Lightbulb size={20} /> },
    ];

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-brand">
                    <Sprout color="var(--primary)" size={26} />
                    <span className="brand-text">AgriGuard.</span>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Languages size={18} color="var(--text-main)" />
                        <select
                            className="language-selector"
                            value={currentLang}
                            onChange={handleLanguageChange}
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
