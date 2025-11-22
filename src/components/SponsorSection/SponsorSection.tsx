import React from 'react';
import styles from './SponsorSection.module.css';
import { i } from 'motion/react-client';
import HeaderText from '../HeaderText/HeaderText';

interface Sponsor {
  image: string;
  name?: string;
}

const SponsorSection: React.FC<{ sponsors: Sponsor[] }> = ({ sponsors = [] }) => {
  return (
    <div className={styles.sponsorSection}>
      <h2 className={styles.headerText}></h2>
       <HeaderText text="Platform Features" subHeader=" " />   
      <div className={styles.sponsorGrid}>
        {sponsors.map((sponsor, index) => (
          <div key={index} className={styles.sponsorItem}>
            <img
              src={sponsor.image}
              alt={sponsor.name || `Sponsor ${index + 1}`}
              className={styles.sponsorImage}
            />
          </div>
        ))}
        {sponsors.length === 0 && (
          <div className={styles.placeholderText}>
            Sponsor images will be displayed here 
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorSection;