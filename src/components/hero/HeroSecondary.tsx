import React from 'react';
import styles from './HeroSecondary.module.css';

const HeroSecondary: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.headline}>Build on Blockchain</h2>
        <p className={styles.subtext}>
          Leverage cutting-edge technology to create decentralized applications that scale.
        </p>
        <button className={styles.cta}>Learn More</button>
      </div>
    </section>
  );
};

export default HeroSecondary;
