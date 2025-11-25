import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroMain from '../../components/hero/HeroMain/HeroMain';
import GigCard from '../../components/card/GigCard/GigCard';
import HomeGameCard from '../../components/HomeGameCard/HomeGameCard';
import Footer from '../../components/footer/Footer';
import WorkFlow from '../../components/work flow/WorkFlow';
import Button1 from '../../components/button/Button1/Button1';
import Button5W from '../../components/button/Button5White1/Button5White1';
import Button2 from '../../components/button/Button2/Button2';
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
  const navigate = useNavigate();
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
     
      <div className={styles.homeContent}>
        <HeroMain />
     
      
      
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
         
        
         <div id="feature">
           <HeaderText text="Built for Modern Freelancers" subHeader="Eliminate payment disputes, reduce fees, and build trust with blockchain-powered 
agreements " />
         </div>
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
      {/* Promotional Strip */}
      <section className={styles.promoStrip} aria-label="Earn with us promotional">
        <div className={styles.promoInner}>
          <div className={styles.promoText}>
            <div className={styles.topBtn}>
              <Button2 text="View more →" onClick={() => navigate('/all-gigs')} />
            </div>

            <h2>Earn With Us, Become a Developer</h2>
            <p>Eliminate payment disputes, reduce fees, and build trust with blockchain-powered agreements</p>

            <div className={styles.bottomBtn}>
              <Button1 text="Join " onClick={() => console.log('Join now')} />
            </div>
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
              featuredGigs.map((gig) => {
                // Defensive checks: developer or profile may be null
                const dev = gig.developer || { profile: {}, reputation: { rating: 0, reviewCount: 0 } };
                const profile = dev.profile || {};
                const reputation = dev.reputation || { rating: 0, reviewCount: 0 };
                const avatar = profile.avatar || undefined;
                const gigImage = (gig.images && gig.images[0] && gig.images[0].url) || undefined;

                return (
                  <GigCard 
                    key={gig._id}
                    gigId={gig._id}
                    title={gig.title || 'Untitled Gig'}
                    description={gig.description || 'No description available'}
                    rating={reputation.rating ?? gig.rating?.average ?? 0}
                    reviewCount={reputation.reviewCount ?? gig.rating?.count ?? 0}
                    userImage={avatar}
                    userName={profile.name || 'Anonymous'}
                    userRole="Freelance Developer"
                    price={gig.pricing?.amount ?? 0}
                    currency={gig.pricing?.currency ?? 'USD'}
                    skills={Array.isArray(profile.skills) ? profile.skills.slice(0, 3) : []}
                    gigImage={gigImage}
                  />
                );
              })
            ) : (
              <p>No gigs available at the moment.</p>
            )}
          </div>
        </div>
      </section>
      {/* Workflow Section */}
      <div id="workflow">
        <HeaderText text="Trusted by Freelancers Worldwide" subHeader=" " />   
        <WorkFlow />
      </div>

      <About />
      <SponsorSection sponsors={sponsors} />      
      <Footer />
      </div>
    </div>
  );
};

export default Home;
