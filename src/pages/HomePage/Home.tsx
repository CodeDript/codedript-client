import React from 'react';
import HeroMain from '../../components/hero/HeroMain';
import HeroSecondary from '../../components/hero/HeroSecondary';
import HeroTertiary from '../../components/hero/HeroTertiary';
import CardOne from '../../components/card/CardOne';
import CardTwo from '../../components/card/CardTwo';
import CardThree from '../../components/card/CardThree';
import Footer from '../../components/footer/Footer';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <HeroMain />
      <HeroSecondary />
      <HeroTertiary />
      
      {/* Cards Section */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsContainer}>
          <h2 className={styles.sectionTitle}>Why Choose Code Dript?</h2>
          <div className={styles.cardsGrid}>
            <CardOne />
            <CardTwo />
            <CardThree />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Home;
