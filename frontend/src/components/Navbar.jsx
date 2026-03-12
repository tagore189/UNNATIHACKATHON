import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, CloudSun, Sprout, Bug, Droplets,
    ShieldAlert, TrendingUp, Lightbulb, LogOut,
    FlaskConical, Satellite, Languages
} from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
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
        { path: '/sustainability', label: 'Tips', icon: <Lightbulb size={20} /> },
    ];

    return (
        <nav className="navbar">
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
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
