import { useState, useEffect } from 'react';
import axios from 'axios';

// Map states to their primary local language
const stateLanguageMap = {
    'andhra pradesh': 'te',     // Telugu
    'telangana': 'te',          // Telugu
    'tamil nadu': 'ta',         // Tamil
    'karnataka': 'kn',          // Kannada
    'maharashtra': 'mr',        // Marathi
    'gujarat': 'gu',            // Gujarati
    'punjab': 'pa',             // Punjabi
    'west bengal': 'bn',        // Bengali
    'odisha': 'or',             // Odia
    'kerala': 'ml',             // Malayalam
    'assam': 'as',              // Assamese
    // Hindi states
    'uttar pradesh': 'hi',
    'madhya pradesh': 'hi',
    'bihar': 'hi',
    'rajasthan': 'hi',
    'haryana': 'hi',
    'jharkhand': 'hi',
    'chhattisgarh': 'hi',
    'delhi': 'hi',
    'uttarakhand': 'hi',
    'himachal pradesh': 'hi',
};

export const useLocationLanguage = () => {
    const [userLang, setUserLang] = useState(localStorage.getItem('userLanguage') || 'en');
    const [userState, setUserState] = useState(localStorage.getItem('userState') || '');
    const [locationLoaded, setLocationLoaded] = useState(!!localStorage.getItem('userState'));

    useEffect(() => {
        // If we already detected the language before, don't ping API again
        if (locationLoaded) return;

        const detectLocation = async () => {
            try {
                // Determine rough location using coarse IP geolocation (free, no key needed)
                const res = await axios.get('https://ipapi.co/json/');
                
                if (res.data && res.data.country_code === 'IN' && res.data.region) {
                    const stateName = res.data.region.toLowerCase();
                    setUserState(res.data.region);
                    localStorage.setItem('userState', res.data.region);

                    // Check if state has a mapped local language
                    let detectedLang = 'en'; // default
                    
                    for (const [key, langCode] of Object.entries(stateLanguageMap)) {
                        if (stateName.includes(key)) {
                            detectedLang = langCode;
                            break;
                        }
                    }

                    // Only set if not already manually chosen
                    if (!localStorage.getItem('userLanguage')) {
                        setUserLang(detectedLang);
                        localStorage.setItem('userLanguage', detectedLang);
                    }
                }
            } catch (err) {
                console.error('Location detection failed:', err);
            } finally {
                setLocationLoaded(true);
            }
        };

        detectLocation();
    }, [locationLoaded]);

    const changeLanguage = (langCode) => {
        setUserLang(langCode);
        localStorage.setItem('userLanguage', langCode);
        // Force reload to apply language everywhere if needed
        window.dispatchEvent(new Event('languageChange'));
    };

    return { userLang, userState, changeLanguage, locationLoaded };
};
