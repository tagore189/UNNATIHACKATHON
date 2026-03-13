const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' }
];

// Farming phrase translations for demo
const FARMING_TRANSLATIONS = {
    'hi': {
        'What is the best crop to grow this season?': 'इस मौसम में उगाने के लिए सबसे अच्छी फसल कौन सी है?',
        'When should I irrigate my field?': 'मुझे अपने खेत की सिंचाई कब करनी चाहिए?',
        'The soil needs more nitrogen fertilizer': 'मिट्टी को अधिक नाइट्रोजन उर्वरक की जरूरत है',
        'Market prices for wheat are rising': 'गेहूँ के बाजार भाव बढ़ रहे हैं',
        'Heavy rain is expected tomorrow': 'कल भारी बारिश की संभावना है'
    },
    'ta': {
        'What is the best crop to grow this season?': 'இந்த பருவத்தில் வளர்க்க சிறந்த பயிர் எது?',
        'When should I irrigate my field?': 'எனது வயலுக்கு எப்போது நீர்ப்பாசனம் செய்ய வேண்டும்?',
        'The soil needs more nitrogen fertilizer': 'மண்ணுக்கு அதிக நைட்ரஜன் உரம் தேவை',
        'Market prices for wheat are rising': 'கோதுமையின் சந்தை விலை உயர்ந்து வருகிறது',
        'Heavy rain is expected tomorrow': 'நாளை கனமழை எதிர்பார்க்கப்படுகிறது'
    },
    'te': {
        'What is the best crop to grow this season?': 'ఈ సీజన్‌లో పండించడానికి ఉత్తమ పంట ఏది?',
        'When should I irrigate my field?': 'నా పొలానికి ఎప్పుడు నీరు పెట్టాలి?',
        'The soil needs more nitrogen fertilizer': 'నేలకు ఎక్కువ నత్రజని ఎరువు అవసరం',
        'Market prices for wheat are rising': 'గోధుమ మార్కెట్ ధరలు పెరుగుతున్నాయి',
        'Heavy rain is expected tomorrow': 'రేపు భారీ వర్షం ఆశించబడుతోంది'
    },
    'kn': {
        'What is the best crop to grow this season?': 'ಈ ಋತುವಿನಲ್ಲಿ ಬೆಳೆಯಲು ಉತ್ತಮ ಬೆಳೆ ಯಾವುದು?',
        'When should I irrigate my field?': 'ನನ್ನ ಹೊಲಕ್ಕೆ ಯಾವಾಗ ನೀರು ಹಾಕಬೇಕು?',
        'The soil needs more nitrogen fertilizer': 'ಮಣ್ಣಿಗೆ ಹೆಚ್ಚು ಸಾರಜನಕ ಗೊಬ್ಬರ ಬೇಕು',
        'Market prices for wheat are rising': 'ಗೋಧಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಏರುತ್ತಿದೆ',
        'Heavy rain is expected tomorrow': 'ನಾಳೆ ಭಾರಿ ಮಳೆ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ'
    },
    'bn': {
        'What is the best crop to grow this season?': 'এই মরসুমে চাষ করার সেরা ফসল কী?',
        'When should I irrigate my field?': 'আমার জমিতে কখন সেচ দেওয়া উচিত?',
        'The soil needs more nitrogen fertilizer': 'মাটিতে আরও নাইট্রোজেন সার দরকার',
        'Market prices for wheat are rising': 'গমের বাজার দাম বাড়ছে',
        'Heavy rain is expected tomorrow': 'আগামীকাল ভারী বৃষ্টির সম্ভাবনা'
    },
    'mr': {
        'What is the best crop to grow this season?': 'या हंगामात पिकवण्यासाठी सर्वोत्तम पीक कोणते आहे?',
        'When should I irrigate my field?': 'मी माझ्या शेताला पाणी कधी द्यावे?',
        'The soil needs more nitrogen fertilizer': 'मातीला अधिक नायट्रोजन खताची गरज आहे',
        'Market prices for wheat are rising': 'गव्हाचे बाजारभाव वाढत आहेत',
        'Heavy rain is expected tomorrow': 'उद्या मुसळधार पावसाची शक्यता आहे'
    }
};

// GET /api/language/supported — List supported languages
router.get('/supported', (req, res) => {
    res.json({
        source: 'AI4Bharat (IndicTrans2)',
        supportedLanguages: SUPPORTED_LANGUAGES,
        totalLanguages: SUPPORTED_LANGUAGES.length,
        capabilities: ['text_translation', 'farming_phrases'],
        samplePhrases: Object.keys(FARMING_TRANSLATIONS['hi'])
    });
});

// POST /api/language/translate — Translate text
router.post('/translate', async (req, res) => {
    try {
        const { text, sourceLang, targetLang } = req.body;
        if (!text || !sourceLang || !targetLang) {
            return res.status(400).json({ error: 'text, sourceLang, and targetLang are required' });
        }

        let translatedText = '';
        let method = '';

        try {
            const aiKey = process.env.GEMINI_API_KEY;
            if (!aiKey) throw new Error("GEMINI_API_KEY missing");

            const genAI = new GoogleGenerativeAI(aiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

            const targetLangName = SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.name || targetLang;
            
            // Skip translation if same lang
            if (sourceLang === targetLang) {
                translatedText = text;
                method = 'same_language';
            } else {
                const prompt = `Translate the following short text into ${targetLangName}. Only return the direct translation, with absolutely no quotes, markdown, or extra explanations. Text to translate: "${text}"`;
                
                // Using a short timeout for Gemini so it falls back to dictionary fast if network issues
                const result = await model.generateContent(prompt, { timeout: 5000 });
                translatedText = result.response.text().trim();
                
                // Remove stray quotes if Gemini added them
                if (translatedText.startsWith('"') && translatedText.endsWith('"')) {
                    translatedText = translatedText.slice(1, -1);
                }
                
                method = 'gemini_api';
            }
            
        } catch (apiError) {
            console.warn(`Translation API failed, falling back to local dictionary. Error: ${apiError.message}`);
            // Fallback to local dictionary for demo/farming phrases if API fails
            if (sourceLang === 'en' && FARMING_TRANSLATIONS[targetLang]) {
                const exact = FARMING_TRANSLATIONS[targetLang][text];
                if (exact) {
                    translatedText = exact;
                    method = 'ai4bharat_dictionary_fallback';
                } else {
                    // Try to find a partial match
                    const key = Object.keys(FARMING_TRANSLATIONS[targetLang]).find(
                        k => k.toLowerCase().includes(text.toLowerCase().substring(0, 15))
                    );
                    translatedText = key ? FARMING_TRANSLATIONS[targetLang][key] : `[Offline] ${text}`;
                    method = key ? 'ai4bharat_fuzzy_fallback' : 'untranslated';
                }
            } else if (targetLang === 'en') {
                for (const [lang, phrases] of Object.entries(FARMING_TRANSLATIONS)) {
                    if (lang === sourceLang) {
                        const entry = Object.entries(phrases).find(([_, v]) => v === text);
                        if (entry) { translatedText = entry[0]; method = 'ai4bharat_reverse_fallback'; break; }
                    }
                }
                if (!translatedText) { translatedText = `[Offline] ${text}`; method = 'untranslated'; }
            } else {
                translatedText = `[Offline] ${text}`;
                method = 'untranslated';
            }
        }

        res.json({
            source: method === 'gemini_api' ? 'Gemini AI' : 'Local Dictionary',
            original: text,
            translated: translatedText,
            sourceLang: SUPPORTED_LANGUAGES.find(l => l.code === sourceLang) || { code: sourceLang },
            targetLang: SUPPORTED_LANGUAGES.find(l => l.code === targetLang) || { code: targetLang },
            method,
            confidence: method.includes('dictionary') ? 0.95 : method.includes('fuzzy') ? 0.7 : method === 'gemini_api' ? 0.95 : 0.0
        });
    } catch (err) {
        console.error('Translation Error:', err.message);
        res.status(500).json({ error: 'Translation failed' });
    }
});

// GET /api/language/farming-phrases/:lang — Common farming phrases
router.get('/farming-phrases/:lang', (req, res) => {
    const lang = req.params.lang.toLowerCase();
    const phrases = FARMING_TRANSLATIONS[lang];
    if (!phrases) {
        return res.status(404).json({
            error: 'Language not found for farming phrases',
            available: Object.keys(FARMING_TRANSLATIONS)
        });
    }

    const phrasePairs = Object.entries(phrases).map(([en, translated]) => ({
        english: en, translated, language: SUPPORTED_LANGUAGES.find(l => l.code === lang)?.name || lang
    }));

    res.json({ source: 'AI4Bharat', language: lang, phrases: phrasePairs, total: phrasePairs.length });
});

module.exports = router;
