import React from 'react';
import styles from './HeroSecondary.module.css';
import heroGrid from '../../../assets/svg/heroGrid.svg';
import heroOutline from '../../../assets/svg/heroOutline.svg';

const HeroSecondary: React.FC = () => {
  return (
    <section className={styles.hero}>
      <img src={heroGrid} alt="hero grid" className={styles.grid} />
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>Trusted by Freelancers Worldwide</p>
        <h2 className={styles.headline}>Smart Contracts for<br/>Freelance Success</h2>
        <p className={styles.subtext}>
          Create, sign, and manage freelance agreements with blockchain security. Automated escrow, milestone tracking, and instant payments for the modern workforce.
        </p>
      </div>
    </section>
  );
};

export default HeroSecondary;
