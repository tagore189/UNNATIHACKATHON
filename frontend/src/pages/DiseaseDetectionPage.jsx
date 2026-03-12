import React, { useState } from 'react';
import { Bug, Camera, ShieldCheck, Leaf, UploadCloud, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const DiseaseDetectionPage = () => {
    const [mode, setMode] = useState('farming'); // 'farming' or 'gardening'
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setAnalysisResult(null); // Clear previous result
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            setError('Please select an image first.');
            return;
        }

        setIsLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('mode', mode);

        try {
            const response = await axios.post('http://localhost:5000/api/analyze-plant', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setAnalysisResult(response.data.analysis);
            } else {
                setError(response.data.error || 'Failed to analyze the image.');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError(err.response?.data?.error || 'An error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Bug size={40} color="#2e7d32" /> AI Plant & Disease Analysis
            </h1>

            {/* Mode Selection Tabs */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '15px' }}>
                <button 
                    onClick={() => { setMode('farming'); setAnalysisResult(null); setError(''); }}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '30px',
                        backgroundColor: mode === 'farming' ? '#2e7d32' : '#e0e0e0',
                        color: mode === 'farming' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <ShieldCheck size={20} /> Farming Mode
                </button>
                <button 
                    onClick={() => { setMode('gardening'); setAnalysisResult(null); setError(''); }}
                    style={{
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '30px',
                        backgroundColor: mode === 'gardening' ? '#2e7d32' : '#e0e0e0',
                        color: mode === 'gardening' ? 'white' : '#333',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Leaf size={20} /> Gardening Mode
                </button>
            </div>

            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    
                    <h2 style={{ marginBottom: '15px' }}>
                        {mode === 'farming' ? 'Analyze Crop Health & Disease' : 'Analyze Plant Condition & Care'}
                    </h2>
                    
                    <p style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                        {mode === 'farming' 
                            ? 'Upload a photo of your crop to identify diseases, spread rate, and get pesticide recommendations.'
                            : 'Upload a photo of your indoor or outdoor plant to check its condition and get care tips (like manure or watering).'}
                    </p>

                    {/* File Upload Area */}
                    <div style={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: '15px', 
                        padding: '30px', 
                        marginBottom: '20px',
                        backgroundColor: '#fafafa',
                        position: 'relative'
                    }}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange}
                            style={{ 
                                opacity: 0, 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '100%', 
                                height: '100%', 
                                cursor: 'pointer' 
                            }} 
                        />
                        {previewUrl ? (
                            <div>
                                <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '10px', marginBottom: '15px' }} />
                                <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>Click or drag to change image</p>
                            </div>
                        ) : (
                            <div>
                                <UploadCloud size={48} color="#ccc" style={{ marginBottom: '15px' }} />
                                <p style={{ color: '#999', fontWeight: '600' }}>Click or drag an image here</p>
                                <p style={{ color: '#bbb', fontSize: '0.85rem' }}>Supports JPG, PNG, WEBP up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={{ color: '#d32f2f', marginBottom: '20px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
                            {error}
                        </div>
                    )}

                    <button 
                        className="btn-primary" 
                        onClick={handleAnalyze}
                        disabled={isLoading || !selectedImage}
                        style={{ 
                            padding: '15px 40px', 
                            fontSize: '1.1rem', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px', 
                            width: '100%',
                            opacity: (isLoading || !selectedImage) ? 0.7 : 1,
                            cursor: (isLoading || !selectedImage) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? (
                            <><Loader2 className="animate-spin" size={24} /> Analyzing with AI...</>
                        ) : (
                            <><UploadCloud size={24} /> Analyze Image</>
                        )}
                    </button>
                    
                </div>
            </div>

            {/* Analysis Results Display */}
            {analysisResult && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card" 
                    style={{ padding: '40px', marginBottom: '40px', borderLeft: '5px solid #2e7d32' }}
                >
                    <h3 style={{ marginBottom: '20px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={24} /> AI Analysis Report
                    </h3>
                    <div style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#333' }}>
                        <ReactMarkdown>
                            {analysisResult}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <ShieldCheck color="#2e7d32" style={{ marginBottom: '15px' }} />
                    <h3>{mode === 'farming' ? 'Common Diseases' : 'Plant Nutrition'}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {mode === 'farming' 
                            ? 'Learn about Blast, Blight, and Rust to take early preventive measures.' 
                            : 'Understand how NPK (Nitrogen, Phosphorus, Potassium) affects your home plants.'}
                    </p>
                </div>
                <div className="glass-card" style={{ padding: '25px' }}>
                    <Bug color="#c62828" style={{ marginBottom: '15px' }} />
                    <h3>{mode === 'farming' ? 'Pest Database' : 'Indoor Pests'}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        {mode === 'farming' 
                            ? 'Comprehensive guide on identifying and controlling major crop pests.' 
                            : 'Identify and treat common houseplant pests like spider mites and aphids safely.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetectionPage;
