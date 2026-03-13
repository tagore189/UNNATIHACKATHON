import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X, Bot, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// ── Language codes for Web Speech API ──────────────────────────────────────
const SPEECH_LANG_MAP = {
    en: 'en-IN', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN',
    kn: 'kn-IN', mr: 'mr-IN', gu: 'gu-IN', bn: 'bn-IN',
    pa: 'pa-IN', ml: 'ml-IN', or: 'or-IN',
};

// ── Pre-translated bot responses ────────────────────────────────────────────
const RESPONSES = {
    weather: {
        en: 'Opening weather forecast for you.',
        hi: 'आपके लिए मौसम पूर्वानुमान खोल रहा हूँ।',
        te: 'మీ కోసం వాతావరణ అంచనా తెరుస్తున్నాను।',
        ta: 'உங்களுக்கான வானிலை முன்னறிவிப்பை திறக்கிறேன்.',
        kn: 'ನಿಮಗಾಗಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'तुमच्यासाठी हवामान अंदाज उघडत आहे.',
        gu: 'તમારા માટે હવામાન આગાહી ખોલુ છું.',
        bn: 'আপনার জন্য আবহাওয়ার পূর্বাভাস খুলছি।',
        pa: 'ਤੁਹਾਡੇ ਲਈ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'നിങ്ങൾക്കായി കാലാവസ്ഥ പ്രവചനം തുറക്കുന്നു.',
        or: 'ଆପଣଙ୍କ ପାଇଁ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ଖୋଲୁଛି।',
    },
    crop: {
        en: 'Opening crop advisor for you.',
        hi: 'आपके लिए फसल सलाहकार खोल रहा हूँ।',
        te: 'మీ కోసం పంట సలహాదారుని తెరుస్తున్నాను.',
        ta: 'உங்களுக்கான பயிர் ஆலோசகரை திறக்கிறேன்.',
        kn: 'ನಿಮಗಾಗಿ ಬೆಳೆ ಸಲಹೆಗಾರನನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'तुमच्यासाठी पीक सल्लागार उघडत आहे.',
        gu: 'તમારા માટે પાક સલાહકાર ખોલુ છું.',
        bn: 'আপনার জন্য ফসল পরামর্শদাতা খুলছি।',
        pa: 'ਤੁਹਾਡੇ ਲਈ ਫਸਲ ਸਲਾਹਕਾਰ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'നിങ്ങൾക്കായി വിള ഉപദേഷ്ടാവ് തുറക്കുന്നു.',
        or: 'ଆପଣଙ୍କ ପାଇଁ ଫସଲ ଉପଦେଷ୍ଟା ଖୋଲୁଛି।',
    },
    disease: {
        en: 'Opening crop disease detection.',
        hi: 'फसल रोग पहचान खोल रहा हूँ।',
        te: 'పంట వ్యాధి గుర్తింపు తెరుస్తున్నాను.',
        ta: 'பயிர் நோய் கண்டறிதலை திறக்கிறேன்.',
        kn: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆಯನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'पीक रोग ओळख उघडत आहे.',
        gu: 'પાક રોગ શોધ ખોલુ છું.',
        bn: 'ফসলের রোগ শনাক্তকরণ খুলছি।',
        pa: 'ਫਸਲ ਰੋਗ ਖੋਜ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'വിള രോഗ കണ്ടെത്തൽ തുറക്കുന്നു.',
        or: 'ଫସଲ ରୋଗ ଚିହ୍ନଟ ଖୋଲୁଛି।',
    },
    market: {
        en: 'Opening market prices.',
        hi: 'मंडी भाव खोल रहा हूँ।',
        te: 'మార్కెట్ ధరలు తెరుస్తున్నాను.',
        ta: 'சந்தை விலைகளை திறக்கிறேன்.',
        kn: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'बाजार भाव उघडत आहे.',
        gu: 'બજાર ભાવ ખોલુ છું.',
        bn: 'বাজার দর খুলছি।',
        pa: 'ਮੰਡੀ ਭਾਅ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'വിപണി വില തുറക്കുന്നു.',
        or: 'ବଜାର ଦର ଖୋଲୁଛି।',
    },
    soil: {
        en: 'Opening soil health report.',
        hi: 'मिट्टी स्वास्थ्य रिपोर्ट खोल रहा हूँ।',
        te: 'నేల ఆరోగ్య నివేదిక తెరుస్తున్నాను.',
        ta: 'மண் ஆரோக்கிய அறிக்கையை திறக்கிறேன்.',
        kn: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ವರದಿ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'माती आरोग्य अहवाल उघडत आहे.',
        gu: 'માટી આરોગ્ય અહેવાલ ખોલુ છું.',
        bn: 'মাটির স্বাস্থ্য প্রতিবেদন খুলছি।',
        pa: 'ਮਿੱਟੀ ਸਿਹਤ ਰਿਪੋਰਟ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'മണ്ണ് ആരോഗ്യ റിപ്പോർട്ട് തുറക്കുന്നു.',
        or: 'ମାଟି ସ୍ୱାସ୍ଥ୍ୟ ରିପୋର୍ଟ ଖୋଲୁଛି।',
    },
    satellite: {
        en: 'Opening satellite maps.',
        hi: 'उपग्रह मानचित्र खोल रहा हूँ।',
        te: 'ఉపగ్రహ పటాలు తెరుస్తున్నాను.',
        ta: 'செயற்கைக்கோள் வரைபடங்களை திறக்கிறேன்.',
        kn: 'ಉಪಗ್ರಹ ನಕ್ಷೆಗಳನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'उपग्रह नकाशे उघडत आहे.',
        gu: 'સેટેલાઇટ નકશા ખોલુ છું.',
        bn: 'স্যাটেলাইট মানচিত্র খুলছি।',
        pa: 'ਸੈਟੇਲਾਈਟ ਨਕਸ਼ੇ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'ഉപഗ്രഹ ഭൂപടം തുറക്കുന്നു.',
        or: 'ଉପଗ୍ରହ ମ୍ୟାପ ଖୋଲୁଛି।',
    },
    irrigation: {
        en: 'Opening irrigation advice.',
        hi: 'सिंचाई सलाह खोल रहा हूँ।',
        te: 'నీటిపారుదల సలహా తెరుస్తున్నాను.',
        ta: 'பாசன ஆலோசனையை திறக்கிறேன்.',
        kn: 'ನೀರಾವರಿ ಸಲಹೆ ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'सिंचन सल्ला उघडत आहे.',
        gu: 'સિંચાઈ સલાહ ખોલુ છું.',
        bn: 'সেচ পরামর্শ খুলছি।',
        pa: 'ਸਿੰਚਾਈ ਸਲਾਹ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'ജലസേചന ഉപദേശം തുറക്കുന്നു.',
        or: 'ଜଳସେଚନ ପରାମର୍ଶ ଖୋଲୁଛି।',
    },
    gardening: {
        en: 'Opening gardening assistant.',
        hi: 'बागवानी सहायक खोल रहा हूँ।',
        te: 'తోటపని సహాయకుడిని తెరుస్తున్నాను.',
        ta: 'தோட்டக்கலை உதவியாளரை திறக்கிறேன்.',
        kn: 'ತೋಟಗಾರಿಕೆ ಸಹಾಯಕನನ್ನು ತೆರೆಯುತ್ತಿದ್ದೇನೆ.',
        mr: 'बागकाम सहाय्यक उघडत आहे.',
        gu: 'બાગકામ સહાયક ખોલુ છું.',
        bn: 'বাগান করার সহায়তাকারী খুলছি।',
        pa: 'ਬਾਗਬਾਨੀ ਸਹਾਇਕ ਖੋਲ੍ਹ ਰਿਹਾ ਹਾਂ।',
        ml: 'തോട്ടക്കൃഷി സഹായകൻ തുറക്കുന്നു.',
        or: 'ବଗିଚା ସହାୟକ ଖୋଲୁଛି।',
    },
    dashboard: {
        en: 'Going to dashboard.',
        hi: 'डैशबोर्ड पर जा रहा हूँ।',
        te: 'డాష్‌బోర్డ్‌కు వెళుతున్నాను.',
        ta: 'டாஷ்போர்டுக்கு செல்கிறேன்.',
        kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗುತ್ತಿದ್ದೇನೆ.',
        mr: 'डॅशबोर्डवर जात आहे.',
        gu: 'ડૅશબૉર્ડ પર જઈ રહ્યો છું.',
        bn: 'ড্যাশবোর্ডে যাচ্ছি।',
        pa: 'ਡੈਸ਼ਬੋਰਡ ਤੇ ਜਾ ਰਿਹਾ ਹਾਂ।',
        ml: 'ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു.',
        or: 'ଡ୍ୟାସ୍‌ବୋର୍ଡ ଯାଉଛି।',
    },
    unknown: {
        en: 'I can help with weather, crops, disease, market prices, soil, irrigation, or maps. Please try again.',
        hi: 'मैं मौसम, फसल, रोग, मंडी भाव, मिट्टी, सिंचाई या नक्शे में मदद कर सकता हूँ।',
        te: 'నేను వాతావరణం, పంట, వ్యాధి, మార్కెట్ ధరలు, నేల, నీటిపారుదల లేదా పటాలలో సహాయపడగలను.',
        ta: 'வானிலை, பயிர், நோய், சந்தை விலை, மண், பாசனம் உதவ முடியும்.',
        kn: 'ಹವಾಮಾನ, ಬೆಳೆ, ರೋಗ, ಮಾರುಕಟ್ಟೆ, ಮಣ್ಣು, ನೀರಾವರಿ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.',
        mr: 'हवामान, पीक, रोग, बाजार भाव, माती, सिंचन मध्ये मदत करेन.',
        gu: 'હું હવામાન, પાક, રોગ, બજાર, માટી, સિંચાઈ મદદ કરી શકું.',
        bn: 'আমি আবহাওয়া, ফসল, রোগ, বাজার দর, মাটি, সেচে সাহায্য করতে পারি।',
        pa: 'ਮੈਂ ਮੌਸਮ, ਫਸਲ, ਰੋਗ, ਮੰਡੀ ਭਾਅ, ਮਿੱਟੀ, ਸਿੰਚਾਈ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।',
        ml: 'കാലാവസ്ഥ, വിള, രോഗം, വിപണി, മണ്ണ്, ജലസേചനം ഉതകാം.',
        or: 'ମୁଁ ପାଣିପାଗ, ଫସଲ, ରୋଗ, ବଜାର, ମାଟି, ଜଳସେଚନରେ ସାହାଯ୍ୟ କରିପାରିବି।',
    },
};

// ── Intent parser — keyword matching across languages ───────────────────────
function parseIntent(text) {
    const t = text.toLowerCase();
    if (/weather|mausam|मौसम|baarish|बारिश|vana|వాన|mazha|mazham|வானிலை|ಹವಾಮಾನ|हवामान|வெளி|ਮੌਸਮ|আবহাওয়া|ಹವಾ|വാണ|पानी पड়া/.test(t)) return { intent: 'weather', route: '/weather' };
    if (/crop|fasal|फसल|pantalu|పంట|பயிர்|ಬೆಳೆ|pikas|पीक|pako|ਫਸਲ|ফসল|ফসলের|veil|viḷaicci|vili/.test(t)) return { intent: 'crop', route: '/crop-advisor' };
    if (/disease|bimari|बीमारी|vyadi|వ్యాధి|நோய்|ರೋಗ|rog|रोग|dhibara|ਰੋਗ|রোগ|roga|rogam/.test(t)) return { intent: 'disease', route: '/disease-detection' };
    if (/market|mandi|मंडी|bazaar|bhav|भाव|dhara|ధర|விலை|ಬೆಲೆ|bazar|बाजार|ਮੰਡੀ|বাজার|dara|vila/.test(t)) return { intent: 'market', route: '/market-prices' };
    if (/soil|mitti|मिट्टी|nela|నేల|மண்|ಮಣ್ಣು|mali|माती|ਮਿੱਟੀ|মাটি|mati|māṭi/.test(t)) return { intent: 'soil', route: '/soil-health' };
    if (/map|satellite|naksha|नक्शा|పటం|வரைபடம்|ನಕ್ಷೆ|ਨਕਸ਼ਾ|মানচিত্র|bhuvan|isro/.test(t)) return { intent: 'satellite', route: '/satellite-map' };
    if (/irrigat|sinchai|सिंचाई|neeru|నీరు|நீர்|ನೀರು|paani|पानी|ਸਿੰਚਾਈ|সেচ|jala/.test(t)) return { intent: 'irrigation', route: '/irrigation' };
    if (/garden|bageeche|बगीचा|tota|తోట|தோட்ட|ತೋಟ|bagh|बाग|ਬਾਗ|বাগান|baga/.test(t)) return { intent: 'gardening', route: '/gardening' };
    if (/dashboard|home|mukhy|முகப்பு|ಮುಖ್ಯ|मुख्य|ਹੋਮ|হোম|mukha/.test(t)) return { intent: 'dashboard', route: '/dashboard' };
    return { intent: 'unknown', route: null };
}

// ── VoiceBot Component ───────────────────────────────────────────────────────
const VoiceBot = () => {
    const { currentLang } = useLanguage();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [statusText, setStatusText] = useState('');
    const recognitionRef = useRef(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
        utterance.rate = 0.88;
        utterance.pitch = 1.05;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }, [currentLang]);

    const addMessage = (role, text) => {
        setChatHistory(prev => [...prev.slice(-8), { role, text, id: Date.now() }]);
    };

    const handleListen = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Voice input not supported. Please use Chrome.');
            return;
        }
        if (isListening) {
            recognitionRef.current?.stop();
            return;
        }

        setIsOpen(true);
        const recognition = new SpeechRecognition();
        recognition.lang = SPEECH_LANG_MAP[currentLang] || 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognitionRef.current = recognition;

        recognition.onstart = () => {
            setIsListening(true);
            setStatusText('Listening…');
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setStatusText('');
            addMessage('user', transcript);

            const { intent, route } = parseIntent(transcript);
            const responseText = RESPONSES[intent]?.[currentLang] || RESPONSES[intent]?.en || RESPONSES.unknown.en;

            setTimeout(() => {
                addMessage('bot', responseText);
                speak(responseText);
                if (route) {
                    setTimeout(() => navigate(route), 1200);
                }
            }, 300);
        };

        recognition.onend = () => {
            setIsListening(false);
            setStatusText('');
        };

        recognition.onerror = (e) => {
            setIsListening(false);
            setStatusText('');
            if (e.error === 'not-allowed') {
                addMessage('bot', 'Microphone access denied. Please enable it in browser settings.');
            }
        };

        recognition.start();
    }, [currentLang, isListening, navigate, speak]);

    return (
        <>
            {/* Chat Panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '95px', right: '24px',
                    width: '320px', maxHeight: '420px',
                    background: 'linear-gradient(145deg, #0d1b0f, #1a2e1c)',
                    borderRadius: '20px', border: '1px solid rgba(46,125,50,0.5)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 9998, overflow: 'hidden',
                    animation: 'botPanelIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                }}>
                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                        padding: '14px 18px', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Bot size={20} color="white" />
                            </div>
                            <div>
                                <div style={{ color: 'white', fontWeight: '700', fontSize: '0.92rem' }}>AgriBot</div>
                                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem' }}>
                                    {isListening ? '🔴 Listening…' : isSpeaking ? '🔊 Speaking…' : '● Ready'}
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>

                    {/* Chat messages */}
                    <div style={{
                        flex: 1, overflowY: 'auto', padding: '14px',
                        display: 'flex', flexDirection: 'column', gap: '10px',
                    }}>
                        {chatHistory.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginTop: '20px' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎙️</div>
                                Click the mic below and speak.<br />
                                Try: "Show me weather" or "Crop advice"
                            </div>
                        )}
                        {chatHistory.map(msg => (
                            <div key={msg.id} style={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            }}>
                                <div style={{
                                    maxWidth: '85%',
                                    background: msg.role === 'user'
                                        ? 'linear-gradient(135deg, #2e7d32, #43a047)'
                                        : 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    padding: '9px 13px',
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    fontSize: '0.84rem', lineHeight: '1.4',
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {statusText && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem',
                            }}>
                                <span style={{ animation: 'pulse 1s infinite' }}>●</span> {statusText}
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Mic row inside panel */}
                    <div style={{
                        padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', justifyContent: 'center', flexShrink: 0,
                    }}>
                        <button
                            onClick={handleListen}
                            style={{
                                width: '52px', height: '52px', borderRadius: '50%',
                                background: isListening
                                    ? 'linear-gradient(135deg, #c62828, #e53935)'
                                    : 'linear-gradient(135deg, #2e7d32, #43a047)',
                                border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: isListening ? '0 0 0 8px rgba(198,40,40,0.25)' : '0 0 0 0px transparent',
                                transition: 'all 0.3s ease',
                                animation: isListening ? 'micPulse 1s infinite' : 'none',
                            }}
                        >
                            {isListening ? <MicOff size={22} color="white" /> : <Mic size={22} color="white" />}
                        </button>
                    </div>
                </div>
            )}

            {/* Floating FAB button */}
            <button
                onClick={() => {
                    if (!isOpen) setIsOpen(true);
                    handleListen();
                }}
                title="Talk to AgriBot"
                style={{
                    position: 'fixed', bottom: '24px', right: '24px',
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: isListening
                        ? 'linear-gradient(135deg, #c62828, #e53935)'
                        : 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: isListening
                        ? '0 0 0 12px rgba(198,40,40,0.2), 0 8px 24px rgba(198,40,40,0.4)'
                        : '0 8px 24px rgba(46,125,50,0.5)',
                    zIndex: 9999,
                    transition: 'all 0.3s ease',
                    animation: isListening ? 'micPulse 1s infinite' : 'botFloat 3s ease-in-out infinite',
                }}
            >
                {isListening ? <MicOff size={28} color="white" /> : <Mic size={28} color="white" />}

                {/* Tooltip */}
                {!isOpen && (
                    <div style={{
                        position: 'absolute', right: '74px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(0,0,0,0.8)', color: 'white',
                        padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem',
                        whiteSpace: 'nowrap', pointerEvents: 'none',
                        opacity: 0, animation: 'tooltipAppear 0.3s 2s forwards',
                    }}>
                        🎙️ Talk to AgriBot
                    </div>
                )}

                {/* Toggle chat panel icon */}
                <div style={{
                    position: 'absolute', top: '-6px', right: '-6px',
                    width: '22px', height: '22px', borderRadius: '50%',
                    background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                }}
                    onClick={(e) => { e.stopPropagation(); setIsOpen(o => !o); }}
                >
                    {isOpen ? <ChevronDown size={13} color="#2e7d32" /> : <ChevronUp size={13} color="#2e7d32" />}
                </div>
            </button>
        </>
    );
};

export default VoiceBot;
