import React from 'react';
import styles from './HeroMain.module.css';
import layer5copy3 from '../../../assets/HeroMain/Layer 5 copy 3.svg';
import logo from '../../../assets/HeroMain/nanologo.svg';
import dript from '../../../assets/HeroMain/dript.svg';
import blackbar from '../../../assets/HeroMain/blackbb.svg';
import partical from '../../../assets/HeroMain/1 copy 4.svg';
import partical2 from '../../../assets/HeroMain/1 copy 6.svg';
import { useNavigate } from 'react-router-dom';
// import Hyperspeed from '../Background/Hyperspeed/Hyperspeed';

const HeroMain: React.FC = () => {

  const navigate = useNavigate();

  return (
    <div className={styles.heroBackground}>
      {/* <Hyperspeed/> */}
      
      <img src={layer5copy3} alt="decorative outline" className={styles.decorativeOutline} />
      <img src={logo} alt="decorative outline" className={styles.decorativeOutline} />
       <img src={partical2} alt="decorative outline" className={styles.decorativeOutlinep2} />
       <img src={partical2} alt="decorative outline" className={styles.decorativeOutlinep3} />
      <img src={dript} alt="decorative outline" className={styles.decorativeOutline} />
       <img src={partical} alt="decorative outline" className={styles.decorativeOutlinep1} />
       <img src={blackbar} alt="decorative outline" className={styles.decorativeOutline4} />
      <div className={styles.heroContent}>
        <div className={styles.heroContainer}>
          <div className={styles.textContainer}>
            <div>
              <div className={styles.svgContainer}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 877 138"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M-1 3H79.6116L164.582 135H301.726L327.899 105.388H877"
                    stroke="white"
                    strokeOpacity="0.25"
                    strokeWidth="5"
                  />
                </svg>
              </div>
              <h1 className={styles.heroTitle}>{`Smart Contracts for\nFreelance Success`}</h1>
              <p className={styles.heroSubtitle}>Create, sign, and manage freelance agreements with blockchain security.
Automated escrow, milestone tracking, and instant payments for the modern
workforce.</p>
            </div>
          </div>
          <div className={styles.buttonWrapper}>
            
            {/* <button
              className={styles.svgButtonContainer}
              type="button"
              onClick={() => navigate('/raceday')}
            >
                
              <span className={styles.svgButtonText}>BOOK YOUR</span>
              <span className={styles.svgButtonText2}>RACE SLOT</span>
              <span className={styles.hoverText}>PROCEED →</span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};


export default HeroMain;
