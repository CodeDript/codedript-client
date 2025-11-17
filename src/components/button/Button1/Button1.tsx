import React, { useEffect, useRef, useState } from 'react';
import styles from './Button1.module.css';

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ text = "View more", onClick, className }) => {
    const [displayText, setDisplayText] = useState<string>(text);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<number | null>(null);

    const targetText = " CLICK"; // final word on hover (uppercase for cyber look)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, []);

    const startScramble = () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        let progress = 0; // progress 0..1
        const steps = 12; // ticks to resolve
        const interval = window.setInterval(() => {
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
    return (
        <button
            className={`${styles.customButton} ${className || ''}`}
            onClick={onClick}
            onMouseEnter={() => {
                setIsHovering(true);
                startScramble();
            }}
            onMouseLeave={() => {
                setIsHovering(false);
                resetText();
            }}
        >
            {/* Base background shape */}
            <svg className={styles.buttonBase} width="100%" height="100%" viewBox="0 0 308 99" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                    {/* gradient goes from dark gray at the left to white on the right (gives subtle contrast) */}
                    <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                       
                        <stop offset="100%" stopColor="#dbdbdbff" stopOpacity="1" />
                    </linearGradient>
                </defs>
                <mask id="path-1-inside-1_37_1629" fill="white">
                    <path d="M32.7157 64.9509V15H293V51.4049L258.023 84H15L32.7157 64.9509Z"/>
                </mask>
                <path d="M32.7157 15V-85H-67.2843V15H32.7157ZM32.7157 64.9509L105.943 133.052L132.716 104.264V64.9509H32.7157ZM15 84L-58.2271 15.8986L-214.562 184H15V84ZM258.023 84V184H297.395L326.199 157.158L258.023 84ZM293 51.4049L361.176 124.563L393 94.9058V51.4049H293ZM293 15H393V-85H293V15ZM32.7157 15H-67.2843V64.9509H32.7157H132.716V15H32.7157ZM32.7157 64.9509L-40.5114 -3.15043L-58.2271 15.8986L15 84L88.2271 152.101L105.943 133.052L32.7157 64.9509ZM15 84V184H258.023V84V-16H15V84ZM258.023 84L326.199 157.158L361.176 124.563L293 51.4049L224.824 -21.753L189.847 10.8421L258.023 84ZM293 51.4049H393V15H293H193V51.4049H293ZM293 15V-85H32.7157V15V115H293V15Z" fill="#dbdbdbff" mask="url(#path-1-inside-1_37_1629)"/>
            </svg>

            {/* Inner border shape */}
            <svg className={styles.buttonBorder} width="100%" height="100%" viewBox="0 0 308 99" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <path d="M290.5 17.5V50.3174L257.038 81.5H20.7393L34.5459 66.6533L35.2158 65.9336V17.5H290.5Z" stroke="white" strokeOpacity="0.7" strokeWidth="5" shapeRendering="crispEdges"/>
            </svg>

            <span className={`${styles.buttonText} ${isHovering ? styles.textHover : ''} ${isHovering ? styles['textHover-center'] : ''}`}>{displayText}</span>
                <svg className={`${styles.arrow} ${isHovering ? styles.arrowHidden : ''}`} width="16" height="10" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 6H19M19 6L14 1M19 6L14 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </button>
    );
};

export default Button;
