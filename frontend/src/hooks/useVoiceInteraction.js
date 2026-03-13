import { useState, useCallback } from 'react';

const LANG_MAP = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN',
    'mr': 'mr-IN',
    'gu': 'gu-IN',
    'bn': 'bn-IN',
    'pa': 'pa-IN',
    'ml': 'ml-IN',
    'or': 'or-IN'
};

export const useVoiceInteraction = (currentLang = 'en') => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    const speak = useCallback((text) => {
        if (!window.speechSynthesis) {
            console.error('Speech synthesis not supported');
            return;
        }

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = LANG_MAP[currentLang] || 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [currentLang]);

    const stopSpeaking = useCallback(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const startListening = useCallback((onResult) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice input not supported on this browser. Please try Chrome.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = LANG_MAP[currentLang] || 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            if (onResult) onResult(result);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                alert('Microphone access denied. Please enable it in browser settings.');
            }
        };

        recognition.start();
    }, [currentLang]);

    return {
        speak,
        stopSpeaking,
        isSpeaking,
        startListening,
        isListening,
        transcript
    };
};
