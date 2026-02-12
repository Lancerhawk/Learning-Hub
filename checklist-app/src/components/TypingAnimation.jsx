import React, { useState, useEffect } from 'react';

export default function TypingAnimation({ text, speed = 100, className = '' }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showCursor, setShowCursor] = useState(true);

    // Reset animation when text changes
    // Reset animation when text changes
    // useEffect(() => {
    //     setDisplayedText('');
    //     setCurrentIndex(0);
    // }, [text]);

    // Typing effect
    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, speed]);

    // Blinking cursor effect
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorInterval);
    }, []);

    return (
        <span className={className}>
            {displayedText}
            <span
                className={`inline-block w-0.5 h-5 ml-1 bg-green-500 align-middle transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
                style={{ verticalAlign: 'middle' }}
            />
        </span>
    );
}
