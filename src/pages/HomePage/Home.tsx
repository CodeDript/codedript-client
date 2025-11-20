import React from 'react';
import HeroMain from '../../components/hero/HeroMain/HeroMain';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import CardOne from '../../components/card/CardOne';
import CardTwo from '../../components/card/CardTwo';
import CardThree from '../../components/card/CardThree';
import Footer from '../../components/footer/Footer';
import Button1 from '../../components/button/Button1/Button1';
import Button2 from '../../components/button/Button2/Button2';
import Button3B from '../../components/button/Button3Black1/Button3Black1';
import Button4B from '../../components/button/Button4Black2/Button4Black2';
import Button5W from '../../components/button/Button5White1/Button5White1';
import UserHero from '../../components/hero/UserHero/UserHero';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <HeroMain />
      <HeroSecondary />
      <DeveloperHero />
      <UserHero />
      
      <div className={styles.buttonSection}>
        <Button1 text="VIEW MORE" onClick={() => console.log('View more clicked')} />
      </div>
      
        <div className={styles.buttonSection}>
        <Button2 text="LOGIN" onClick={() => console.log('View more clicked')} />
      </div>
        <div className={styles.buttonSection}>
          <Button3B text="BLACK 1" onClick={() => console.log('Button3B clicked')} />
        </div>
        <div className={styles.buttonSection}>
          <Button4B text="BLACK 2" onClick={() => console.log('Button4B clicked')} />
        </div>
        <div className={styles.buttonSection}>
          <Button5W text="WHITE 1" onClick={() => console.log('Button5W clicked')} />
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
