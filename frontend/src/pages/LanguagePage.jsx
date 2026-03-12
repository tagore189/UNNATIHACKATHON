import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Languages, ArrowRightLeft, Volume2, Mic, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const LanguagePage = () => {
    const [languages, setLanguages] = useState([]);
    const [samplePhrases, setSamplePhrases] = useState([]);
    const [sourceLang, setSourceLang] = useState('en');
    const [targetLang, setTargetLang] = useState('hi');
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [translating, setTranslating] = useState(false);
    const [farmingPhrases, setFarmingPhrases] = useState([]);
    const [activeTab, setActiveTab] = useState('translate');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/language/supported');
                setLanguages(res.data.supportedLanguages);
                setSamplePhrases(res.data.samplePhrases || []);
            } catch (err) { console.error('Language support error', err); }
        };
        fetch();
    }, []);

    useEffect(() => {
        if (activeTab === 'phrases' && targetLang !== 'en') {
            const fetchPhrases = async () => {
                try {
                    const res = await axios.get(`http://localhost:5000/api/language/farming-phrases/${targetLang}`);
                    setFarmingPhrases(res.data.phrases);
                } catch (err) { setFarmingPhrases([]); }
            };
            fetchPhrases();
        }
    }, [activeTab, targetLang]);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setTranslating(true);
        try {
            const res = await axios.post('http://localhost:5000/api/language/translate', {
                text: inputText, sourceLang, targetLang
            });
            setTranslatedText(res.data.translated);
        } catch (err) { console.error('Translate error', err); setTranslatedText('Translation failed.'); }
        setTranslating(false);
    };

    const swapLanguages = () => {
        setSourceLang(targetLang);
        setTargetLang(sourceLang);
        setInputText(translatedText);
        setTranslatedText(inputText);
    };

    const speakText = (text, lang) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : lang === 'te' ? 'te-IN' :
                lang === 'kn' ? 'kn-IN' : lang === 'bn' ? 'bn-IN' : lang === 'mr' ? 'mr-IN' :
                lang === 'gu' ? 'gu-IN' : lang === 'ml' ? 'ml-IN' : lang === 'pa' ? 'pa-IN' : 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const getLangName = (code) => languages.find(l => l.code === code)?.nativeName || code;

    return (
        <div className="fade-in" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Languages size={40} color="#2e7d32" /> Language Translation Tool
            </h1>
            <p style={{ color: '#558b2f', marginBottom: '30px', fontSize: '1.1rem' }}>
                🗣️ Powered by <strong>AI4Bharat IndicTrans2</strong> — Translate between 13 Indian languages
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                {[{ id: 'translate', label: '🔤 Translator', icon: ArrowRightLeft }, { id: 'phrases', label: '🌾 Farming Phrases', icon: BookOpen }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700',
                            backgroundColor: activeTab === tab.id ? '#2e7d32' : '#e8f5e9',
                            color: activeTab === tab.id ? 'white' : '#2e7d32', transition: 'all 0.3s'
                        }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'translate' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Language Selectors */}
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>From</label>
                                <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}>
                                    {languages.map(l => <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>)}
                                </select>
                            </div>
                            <motion.button whileHover={{ rotate: 180 }} onClick={swapLanguages}
                                style={{ padding: '12px', borderRadius: '50%', border: '2px solid #2e7d32', backgroundColor: '#e8f5e9', cursor: 'pointer', marginTop: '20px' }}>
                                <ArrowRightLeft size={20} color="#2e7d32" />
                            </motion.button>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>To</label>
                                <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '1rem' }}>
                                    {languages.map(l => <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Translation Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                        <div className="glass-card" style={{ padding: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ margin: 0 }}>{getLangName(sourceLang)}</h4>
                                <button onClick={() => speakText(inputText, sourceLang)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <Volume2 size={20} color="#2e7d32" />
                                </button>
                            </div>
                            <textarea value={inputText} onChange={e => setInputText(e.target.value)}
                                placeholder="Type or paste text to translate..."
                                style={{ width: '100%', minHeight: '180px', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1.1rem', resize: 'vertical', fontFamily: 'inherit' }} />
                            {/* Sample phrases */}
                            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {samplePhrases.slice(0, 3).map((phrase, i) => (
                                    <button key={i} onClick={() => setInputText(phrase)}
                                        style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #c8e6c9', backgroundColor: '#f1f8e9', color: '#2e7d32', cursor: 'pointer', fontSize: '0.8rem' }}>
                                        {phrase.length > 35 ? phrase.substring(0, 35) + '...' : phrase}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: '25px', backgroundColor: '#f9fbe7' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h4 style={{ margin: 0 }}>{getLangName(targetLang)}</h4>
                                {translatedText && (
                                    <button onClick={() => speakText(translatedText, targetLang)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Volume2 size={20} color="#2e7d32" />
                                    </button>
                                )}
                            </div>
                            <div style={{ minHeight: '180px', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', backgroundColor: 'white', fontSize: '1.1rem' }}>
                                {translating ? <span style={{ color: '#999' }}>Translating...</span> : translatedText || <span style={{ color: '#bbb' }}>Translation will appear here</span>}
                            </div>
                        </div>
                    </div>

                    <button className="btn-primary" onClick={handleTranslate} disabled={translating || !inputText.trim()}
                        style={{ padding: '14px 40px', fontSize: '1.1rem', display: 'block', margin: '0 auto' }}>
                        {translating ? '⏳ Translating...' : '🌐 Translate'}
                    </button>
                </motion.div>
            )}

            {activeTab === 'phrases' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="glass-card" style={{ padding: '25px', marginBottom: '25px' }}>
                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Select Language for Farming Phrases</label>
                        <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ddd', minWidth: '300px' }}>
                            {languages.filter(l => l.code !== 'en').map(l => (
                                <option key={l.code} value={l.code}>{l.nativeName} ({l.name})</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gap: '15px' }}>
                        {farmingPhrases.map((phrase, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                                className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '600', color: '#333', marginBottom: '8px' }}>🇬🇧 {phrase.english}</p>
                                    <p style={{ fontWeight: '700', color: '#2e7d32', fontSize: '1.15rem' }}>{phrase.translated}</p>
                                </div>
                                <button onClick={() => speakText(phrase.translated, targetLang)}
                                    style={{ padding: '10px', borderRadius: '50%', border: '1px solid #c8e6c9', backgroundColor: '#e8f5e9', cursor: 'pointer' }}>
                                    <Volume2 size={20} color="#2e7d32" />
                                </button>
                            </motion.div>
                        ))}
                        {farmingPhrases.length === 0 && (
                            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                <p>No farming phrases available for this language yet.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LanguagePage;
