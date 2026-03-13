import { useState, useEffect } from 'react';

export const useLocationLanguage = () => {
    const [userLang, setUserLang] = useState(localStorage.getItem('userLanguage') || 'en');
    const [userState, setUserState] = useState(localStorage.getItem('userState') || '');
    const [locationLoaded, setLocationLoaded] = useState(true);

    // On mount, apply stored language
    useEffect(() => {
        const stored = localStorage.getItem('userLanguage') || 'en';
        setUserLang(stored);
        if (stored !== 'en') {
            triggerGoogleTranslate(stored);
        }
    }, []);

    /**
     * Reliably trigger Google Translate by finding the hidden .goog-te-combo 
     * select element and setting its value. Retries every 300ms for up to 5s.
     */
    const triggerGoogleTranslate = (langCode) => {
        if (langCode === 'en') {
            // Reset to English: remove the googtrans cookie and reload
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
            // Check if currently translated — if so, reload to reset
            const currentCookie = document.cookie;
            if (currentCookie.includes('googtrans') || document.documentElement.classList.contains('translated-ltr') || document.documentElement.classList.contains('translated-rtl')) {
                window.location.reload();
            }
            return;
        }

        let attempts = 0;
        const maxAttempts = 20; // 20 * 300ms = 6 seconds

        const tryTranslate = setInterval(() => {
            attempts++;
            const select = document.querySelector('.goog-te-combo');
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change', { bubbles: true }));
                clearInterval(tryTranslate);
                console.log(`✅ Language changed to: ${langCode}`);
            } else if (attempts >= maxAttempts) {
                clearInterval(tryTranslate);
                console.warn('⚠️ Google Translate widget not found after retries');
            }
        }, 300);
    };

    const changeLanguage = (langCode) => {
        setUserLang(langCode);
        localStorage.setItem('userLanguage', langCode);
        triggerGoogleTranslate(langCode);
    };

    return { userLang, userState, changeLanguage, locationLoaded, triggerGoogleTranslate };
};
