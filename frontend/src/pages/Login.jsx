import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Lock } from 'lucide-react';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'Invalid credentials');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="glass-card" style={{ padding: '40px', width: '100%', maxWidth: '450px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <Sprout size={48} color="#2e7d32" />
                    <h2 style={{ marginTop: '10px' }}>Welcome Back</h2>
                    <p style={{ color: '#558b2f' }}>Continue your smart farming journey</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #ddd' }}>
                            <Mail size={20} color="#666" style={{ marginRight: '10px' }} />
                            <input
                                type="email"
                                placeholder="Email Address"
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #ddd' }}>
                            <Lock size={20} color="#666" style={{ marginRight: '10px' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                style={{ border: 'none', outline: 'none', width: '100%' }}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#2e7d32', fontWeight: '600', textDecoration: 'none' }}>Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
