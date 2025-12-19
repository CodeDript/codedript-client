import React, { useEffect, useState } from 'react';
import styles from './BackgroundBasePlates.module.css';
import baseplate1 from '../../assets/background/baseplate1.svg';
import baseplate2 from '../../assets/background/baseplate2.svg';
import baseplate3 from '../../assets/background/baseplate3.svg';
import baseplate4 from '../../assets/background/baseplate4.svg';
import baseplate5 from '../../assets/background/baseplate3.svg';
import baseplate6 from '../../assets/background/baseplate4.svg';

const BackgroundBasePlates: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.backgroundContainer}>
      <img 
        src={baseplate1} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate1}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(20%) translateY(${scrollY * -0.1}px)` }}
      />
      <img 
        src={baseplate2} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate2}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(-10%) translateY(${scrollY * -0.15}px)` }}
      />
      <img 
        src={baseplate3} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate3}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(10%) translateY(${scrollY * -0.08}px)` }}
      />
      <img 
        src={baseplate4} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate4}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(-10%) translateY(${scrollY * -0.12}px)` }}
      />

      <img 
        src={baseplate5} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate5}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(15%) translateY(${scrollY * -0.11}px)` }}
      />
      <img 
        src={baseplate6} 
        alt="" 
        className={`${styles.baseplate} ${styles.baseplate6}`} 
        aria-hidden="true" 
        style={{ transform: `translateX(-15%) translateY(${scrollY * -0.13}px)` }}
      />
    </div>
    
  );
};

export default BackgroundBasePlates;
