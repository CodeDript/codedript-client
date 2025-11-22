import React, { useEffect, useRef, useState } from 'react';
import styles from './Button4Black2.module.css';

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    className?: string;
    // optional target word to display during scramble (e.g. "CLICK" or "?")
    target?: string;
}

const Button: React.FC<ButtonProps> = ({ text = "View more", onClick, className}) => {
    const [displayText, setDisplayText] = useState<string>(text);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // final word used by the scramble (can be passed via `target` prop); default to `text`
    const targetText = text;
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    useEffect(() => {
        // observe the button and animate when it scrolls into view (or immediately if already visible)
        const obs = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startScramble();
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        if (buttonRef.current) obs.observe(buttonRef.current);

        return () => {
            obs.disconnect();
            if (intervalRef.current) window.clearInterval(intervalRef.current);
        };
    }, []);

    const startScramble = () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        setIsAnimating(true);
        let progress = 0; // progress 0..1
        const steps = 24; // more ticks = slower reveal
        const interval = window.setInterval(() => {
            // make slightly larger progress step to keep timing consistent
            progress += 1 / steps;
            const result = targetText
                .split("")
                .map((t, i) => {
                    // If we've reached this index, show target char
                    const revealIndex = Math.floor(progress * targetText.length);
                    if (i < revealIndex) return t;
                    // else random cyber char
                    return letters.charAt(Math.floor(Math.random() * letters.length));
                })
                .join("");
            setDisplayText(result);
            if (progress >= 1) {
                window.clearInterval(interval);
                intervalRef.current = null;
                setDisplayText(targetText);
                // keep target visible longer then reset
                window.setTimeout(() => {
                    resetText();
                }, 1400);
            }
        }, 45);

        intervalRef.current = interval;
    };

   const resetText = () => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setDisplayText(text);
    };
    const isWide = displayText.length >= 10;

    // compute a dynamic width increment for longer text (adjust per char)
    const baseWidth = 236; // px — small increase
    const extraPerChar = 9; // keep per-char increment
    const minChars = 5;
    const computedWidth = isWide
        ? baseWidth + (displayText.length - minChars) * extraPerChar
        : baseWidth;

    return (
        <button
            ref={buttonRef}
            className={`${styles.customButton} ${isWide ? styles.wide : ''} ${className || ''}`}
            style={{ width: `${computedWidth}px` }}
            onClick={onClick}
            /* hover triggers removed: animation runs on load/scroll only */
        >
            {/* Base background shape */}
                  <svg className={styles.buttonBase} width="100%" height="100%" viewBox="0 0 308 99" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                    {/* gradient goes from dark gray at the left to white on the right (gives subtle contrast) */}
                    <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                       
                        <stop offset="100%" stopColor="#141414ff" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <mask id="path-1-inside-1_37_1629" fill="white">
                    <path d="M32.7157 64.9509V15H293V51.4049L258.023 84H15L32.7157 64.9509Z"/>
                </mask>
                <path d="M32.7157 15V-85H-67.2843V15H32.7157ZM32.7157 64.9509L105.943 133.052L132.716 104.264V64.9509H32.7157ZM15 84L-58.2271 15.8986L-214.562 184H15V84ZM258.023 84V184H297.395L326.199 157.158L258.023 84ZM293 51.4049L361.176 124.563L393 94.9058V51.4049H293ZM293 15H393V-85H293V15ZM32.7157 15H-67.2843V64.9509H32.7157H132.716V15H32.7157ZM32.7157 64.9509L-40.5114 -3.15043L-58.2271 15.8986L15 84L88.2271 152.101L105.943 133.052L32.7157 64.9509ZM15 84V184H258.023V84V-16H15V84ZM258.023 84L326.199 157.158L361.176 124.563L293 51.4049L224.824 -21.753L189.847 10.8421L258.023 84ZM293 51.4049H393V15H293H193V51.4049H293ZM293 15V-85H32.7157V15V115H293V15Z" fill="#111111ff" mask="url(#path-1-inside-1_37_1629)"/>
            </svg>

            {/* Inner border shape */}
            <svg className={styles.buttonBorder} width="100%" height="100%" viewBox="0 0 308 99" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M290.5 17.5V50.3174L257.038 81.5H20.7393L34.5459 66.6533L35.2158 65.9336V17.5H290.5Z" stroke="white" strokeOpacity="0.05" strokeWidth="5" shapeRendering="crispEdges"/>
            </svg>

            <span className={`${styles.buttonText} ${isAnimating ? styles.textHover : ''} ${isAnimating ? styles['textHover-center'] : ''}`}>{displayText}</span>
              
        </button>
    );
};

export default Button;
