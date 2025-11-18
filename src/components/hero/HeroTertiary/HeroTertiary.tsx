import React from 'react';
import styles from './HeroTertiary.module.css';

const HeroTertiary: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h2 className={styles.headline}>Join the Revolution</h2>
        <p className={styles.subtext}>
          Connect with developers worldwide and shape the future of decentralized technology.
        </p>
        <button className={styles.cta}>Join Now</button>
      </div>
    </section>
  );
};

export default HeroTertiary;
