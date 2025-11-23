import React, { useEffect, useState } from 'react';
import HeroMain from '../../components/hero/HeroMain/HeroMain';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import GigCard from '../../components/card/GigCard/GigCard';
import HomeGameCard from '../../components/HomeGameCard/HomeGameCard';
import Footer from '../../components/footer/Footer';
import WorkFlow from '../../components/work flow/WorkFlow';
import Button1 from '../../components/button/Button1/Button1';
import Button2 from '../../components/button/Button2/Button2';
import Button3B from '../../components/button/Button3Black1/Button3Black1';
import Button4B from '../../components/button/Button4Black2/Button4Black2';
import Button5W from '../../components/button/Button5White1/Button5White1';
import UserHero from '../../components/hero/UserHero/UserHero';
import HeaderText from '../../components/HeaderText/HeaderText';
import About from '../../components/aboutSection/About';
import SponsorSection from '../../components/SponsorSection/SponsorSection';
import sponsored1 from '../../assets/Sponsors/Sponsered_1.png';
import sponsored2 from '../../assets/Sponsors/Sponsored_2.png';
import sponsored3 from '../../assets/Sponsors/Sponsored_3.png';
import sponsored4 from '../../assets/Sponsors/Sponsored_4.png';
import { GigService, type Gig } from '../../api/gigService';

import styles from './Home.module.css';

const Home: React.FC = () => {
  const [featuredGigs, setFeaturedGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sponsors = [
    { image: sponsored1, name: 'Sponsor 1' },
    { image: sponsored2, name: 'Sponsor 2' },
    { image: sponsored3, name: 'Sponsor 3' },
    { image: sponsored4, name: 'Sponsor 4' },
  ];

  useEffect(() => {
    const fetchFeaturedGigs = async () => {
      try {
        setIsLoading(true);
        const response = await GigService.getFeaturedGigs(4);
        setFeaturedGigs(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch featured gigs:', err);
        setError('Failed to load gigs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedGigs();
  }, []);

  return (
    <div className={styles.homePage}>
      <HeroMain />
      {/* <HeroSecondary />
      <DeveloperHero />
      <UserHero /> */}
      
      
        <div className={styles.centerButtonRow}>
          <div className={styles.buttonSection}>
            <Button5W text="Meta Mask" onClick={() => console.log('Meta Mask')} />
          </div>
          <div className={styles.buttonSection}>
            <Button5W text="Ethereum" onClick={() => console.log('Ethereum')} />
          </div>
          <div className={styles.buttonSection}>
            <Button5W text="IPFS" onClick={() => console.log('IPFS')} />
          </div>
          <div className={styles.buttonSection}>
            <Button5W text="Chainlink" onClick={() => console.log('Chainlink')} />
          </div>
          <div className={styles.buttonSection}>
            <Button5W text="WalletConnect" onClick={() => console.log('WalletConnect')} />
          </div>
        </div>
      {/* Cards Section */}
      <section className={styles.cardsSection}>
        <div className={styles.cardsContainer}>
         
         
         <HeaderText text="Built for Modern Freelancers" subHeader="Eliminate payment disputes, reduce fees, and build trust with blockchain-powered 
agreements " />   
          <div className={styles.cardsGrid}>
            <HomeGameCard gameId={1} />
            <HomeGameCard gameId={2} />
            <HomeGameCard gameId={3} />
            <HomeGameCard gameId={4} />
            <HomeGameCard gameId={5} />
            <HomeGameCard gameId={6} />
          </div>
        </div>
      </section>

     
      
      {/* Game Cards Section */}
      <section className={styles.gameCardsSection}>
        <div className={styles.gameCardsContainer}>
         
          <HeaderText text="How CodeDript Works" subHeader="Simple steps to secure agreements " /> 
          <div className={styles.gigCardsGrid}>
            {isLoading ? (
              <p>Loading featured gigs...</p>
            ) : error ? (
              <p>Error loading gigs. Please try again later.</p>
            ) : featuredGigs.length > 0 ? (
              featuredGigs.map((gig) => (
                <GigCard 
                  key={gig._id}
                  title={gig.title}
                  description={gig.description}
                  rating={gig.rating.average}
                  reviewCount={gig.rating.count}
                  userImage={gig.developer.profile.avatar}
                  userName={gig.developer.profile.name || 'Anonymous'}
                  userRole="Freelance Developer"
                  price={gig.pricing.amount}
                  currency={gig.pricing.currency}
                  skills={gig.skills.slice(0, 3)}
                  gigImage={gig.images[0]?.url || "https://via.placeholder.com/700x300"}
                />
              ))
            ) : (
              <p>No gigs available at the moment.</p>
            )}
          </div>
        </div>
      </section>
      {/* Workflow Section */}
      
         <HeaderText text="Trusted by Freelancers Worldwide" subHeader=" " />   
      <WorkFlow />

      <About />
      <SponsorSection sponsors={sponsors} />      
      <Footer />
    </div>
  );
};

export default Home;
