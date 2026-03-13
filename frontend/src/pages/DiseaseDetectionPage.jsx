import React, { useState } from 'react';
import { Bug, Camera, ShieldCheck, Leaf, UploadCloud, Loader2, AlertTriangle, Activity, CalendarCheck, Info, Thermometer, Mic, Volume2, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useLocationLanguage } from '../hooks/useLocationLanguage';
import { useVoiceInteraction } from '../hooks/useVoiceInteraction';

const DiseaseDetectionPage = () => {
    const [mode, setMode] = useState('farming'); // 'farming' or 'gardening'
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const { userLang } = useLocationLanguage();
    const { speak, stopSpeaking, isSpeaking, startListening, isListening } = useVoiceInteraction(userLang);

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
        formData.append('symptoms', symptoms);

        try {
            const response = await axios.post('http://localhost:5000/api/analyze-plant', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success !== false) {
                setAnalysisResult(response.data);
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

                    {/* Symptom Description with Voice Input */}
                    <div style={{ marginBottom: '25px', position: 'relative' }}>
                        <label style={{ display: 'block', textAlign: 'left', marginBottom: '8px', fontWeight: 'bold', color: '#2e7d32' }}>
                            Describe symptoms (Optional):
                        </label>
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Example: Yellow spots on the edges of the leaf..."
                            style={{
                                width: '100%', padding: '15px', borderRadius: '12px',
                                border: '2px solid #e0e0e0', minHeight: '100px',
                                fontStyle: isListening ? 'italic' : 'normal'
                            }}
                        />
                        <button
                            onClick={() => startListening((res) => setSymptoms(prev => prev + ' ' + res))}
                            style={{
                                position: 'absolute', right: '15px', bottom: '15px',
                                background: isListening ? '#ef5350' : '#2e7d32',
                                color: 'white', border: 'none', borderRadius: '50%',
                                width: '36px', height: '36px', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                            }}
                        >
                            <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                        </button>
                    </div>

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
                    style={{ marginBottom: '40px' }}
                >
                    {mode === 'farming' ? (
                        <div className="glass-card" style={{ padding: '40px', borderLeft: '8px solid #2e7d32' }}>
                            {/* Header: Disease Name & Confidence */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                                <div>
                                    <h3 style={{ color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '10px', margin: 0, fontSize: '1.8rem' }}>
                                        <ShieldCheck size={32} /> {analysisResult.diseaseName}
                                    </h3>
                                    {analysisResult.confidenceScore && (
                                        <p style={{ margin: '5px 0 0 42px', color: '#666', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Activity size={16} color="#2e7d32" /> Confidence Score: <span style={{ color: '#2e7d32' }}>{analysisResult.confidenceScore}</span>
                                        </p>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{
                                        padding: '8px 16px',
                                        backgroundColor: analysisResult.severityLevel === 'High' ? '#ffebee' : analysisResult.severityLevel === 'Medium' ? '#fff3e0' : '#e8f5e9',
                                        color: analysisResult.severityLevel === 'High' ? '#c62828' : analysisResult.severityLevel === 'Medium' ? '#e65100' : '#2e7d32',
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <AlertTriangle size={16} /> Severity: {analysisResult.severityLevel}
                                    </div>
                                    <div style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#e3f2fd',
                                        color: '#1565c0',
                                        borderRadius: '20px',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}>
                                        Risk: {analysisResult.spreadRisk}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (isSpeaking) stopSpeaking();
                                            else {
                                                const textToRead = `${analysisResult.diseaseName}. ${analysisResult.description}. Treatment plan includes ${analysisResult.treatmentSuggestions.join(', ')}.`;
                                                speak(textToRead);
                                            }
                                        }}
                                        className="btn-primary"
                                        style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        {isSpeaking ? <Square size={16} fill="white" /> : <Volume2 size={16} />}
                                        {isSpeaking ? 'Stop' : 'Listen Report'}
                                    </button>
                                </div>
                            </div>

                            {/* Info Card: Description */}
                            {analysisResult.description && (
                                <div style={{ backgroundColor: '#f0f4f7', padding: '20px', borderRadius: '12px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                    <Info size={24} color="#1565c0" style={{ flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#1565c0' }}>About this disease</h4>
                                        <p style={{ margin: 0, color: '#444', lineHeight: '1.5' }}>{analysisResult.description}</p>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                                {/* Left Column: Treatment & Spread Alert */}
                                <div>
                                    <h4 style={{ marginBottom: '15px', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '10px' }}><Thermometer size={20} /> Treatment Measures</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                        {analysisResult.treatmentSuggestions?.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
                                    </ul>

                                    {analysisResult.spreadAlert && (
                                        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ffccbc', backgroundColor: '#fff3e0', borderRadius: '12px' }}>
                                            <h4 style={{ margin: '0 0 10px 0', color: '#e65100', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <AlertTriangle size={20} /> Spread Alert
                                            </h4>
                                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#5d4037' }}>{analysisResult.spreadAlert}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Right Column: Action Plan */}
                                <div>
                                    <h4 style={{ marginBottom: '20px', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '10px' }}><CalendarCheck size={20} /> Farmer Action Plan</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {analysisResult.actionPlan?.map((step, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                                <div style={{
                                                    backgroundColor: '#2e7d32',
                                                    color: 'white',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 'bold',
                                                    minWidth: '55px',
                                                    textAlign: 'center'
                                                }}>
                                                    {step.day}
                                                </div>
                                                <p style={{ margin: 0, color: '#333', fontSize: '0.95rem' }}>{step.task}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <h4 style={{ marginTop: '35px', marginBottom: '15px', color: '#1b5e20', display: 'flex', alignItems: 'center', gap: '10px' }}><ShieldCheck size={20} /> Long-term Prevention</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                        {analysisResult.preventionSteps?.map((item, i) => <li key={i} style={{ marginBottom: '8px' }}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ padding: '40px', borderLeft: '5px solid #1565c0' }}>
                            <h3 style={{ color: '#1565c0', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>
                                <Leaf size={28} /> Gardening AI Report
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>Current Condition</h4>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0d47a1' }}>{analysisResult.condition}</p>

                                    <h4 style={{ marginTop: '25px', marginBottom: '10px' }}>⚠️ Warnings</h4>
                                    <p style={{ color: '#c62828', fontWeight: '600' }}>{analysisResult.warnings}</p>
                                </div>

                                <div>
                                    <h4 style={{ marginBottom: '10px' }}>🛠️ Care Steps</h4>
                                    <ul style={{ paddingLeft: '20px', color: '#333' }}>
                                        {analysisResult.careSteps?.map((item, i) => <li key={i} style={{ marginBottom: '5px' }}>{item}</li>)}
                                    </ul>

                                    <div style={{ display: 'flex', gap: '20px', marginTop: '25px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: '#666' }}>Watering</h4>
                                            <p style={{ fontWeight: '600' }}>{analysisResult.watering}</p>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '0.9rem', color: '#666' }}>Sunlight</h4>
                                            <p style={{ fontWeight: '600' }}>{analysisResult.sunlight}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
