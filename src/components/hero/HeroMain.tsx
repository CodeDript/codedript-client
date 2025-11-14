import React from 'react';
import styles from './HeroMain.module.css';

const HeroMain: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.headline}>Welcome to Code Dript</h1>
        <p className={styles.subtext}>
          The future of blockchain-powered development is here. Build, deploy, and scale with confidence.
        </p>
        <button className={styles.cta}>Get Started</button>
      </div>
    </section>
  );
};

export default HeroMain;
