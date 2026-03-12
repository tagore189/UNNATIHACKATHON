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
        // We've disabled automatic IP discovery to prevent unwanted language switching.
        // The language will now only be set by the user's manual choice or default to 'en'.
        if (!localStorage.getItem('userLanguage')) {
            setUserLang('en');
            localStorage.setItem('userLanguage', 'en');
        }
        setLocationLoaded(true);
    }, [locationLoaded]);

    const changeLanguage = (langCode) => {
        setUserLang(langCode);
        localStorage.setItem('userLanguage', langCode);
        // Force reload to apply language everywhere if needed
        window.dispatchEvent(new Event('languageChange'));
    };

    return { userLang, userState, changeLanguage, locationLoaded };
};
