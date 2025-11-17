import React from 'react';
import HeroMain from '../../components/hero/HeroMain';
import HeroSecondary from '../../components/hero/HeroSecondary';
import HeroTertiary from '../../components/hero/HeroTertiary';
import CardOne from '../../components/card/CardOne';
import CardTwo from '../../components/card/CardTwo';
import CardThree from '../../components/card/CardThree';
import Footer from '../../components/footer/Footer';
import Button1 from '../../components/button/Button1/Button1';
import Button2 from '../../components/button/Button2/Button2';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <HeroMain />
      <HeroSecondary />
      <HeroTertiary />
      
      <div className={styles.buttonSection}>
        <Button1 text="LOGIN" onClick={() => console.log('View more clicked')} />
      </div>
      
        <div className={styles.buttonSection}>
        <Button2 text="LOGIN" onClick={() => console.log('View more clicked')} />
      </div>
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
