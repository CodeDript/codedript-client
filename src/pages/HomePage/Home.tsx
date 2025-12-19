import React from 'react';
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
import BackgroundBasePlates from '../../components/BackgroundBasePlates/BackgroundBasePlates';
import sponsored1 from '../../assets/Sponsors/Sponsered_1.png';
import sponsored2 from '../../assets/Sponsors/Sponsored_2.png';
import sponsored3 from '../../assets/Sponsors/Sponsored_3.png';
import sponsored4 from '../../assets/Sponsors/Sponsored_4.png';
import { useGigs } from '../../query/useGigs';


import styles from './Home.module.css';


const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: gigsData, isLoading: gigsLoading, error: gigsError } = useGigs({ limit: 100 });

  const sponsors = [
    { image: sponsored1, name: 'Sponsor 1' },
    { image: sponsored2, name: 'Sponsor 2' },
    { image: sponsored3, name: 'Sponsor 3' },
    { image: sponsored4, name: 'Sponsor 4' },
  ];

  // Derive gigs array from API response
  const gigsList: any[] = Array.isArray(gigsData)
    ? gigsData
    : Array.isArray(gigsData?.gigs)
    ? gigsData.gigs
    : [];

  // Compute top 4 gigs by rating (primary) then review count (secondary)
  const topGigs = React.useMemo(() => {
    return [...gigsList]
      .sort((a, b) => {
        const aRating = a?.developer?.reputation?.rating ?? a?.rating?.average ?? 0;
        const bRating = b?.developer?.reputation?.rating ?? b?.rating?.average ?? 0;
        if (bRating !== aRating) return bRating - aRating;
        const aReviews = a?.developer?.reputation?.reviewCount ?? a?.rating?.count ?? 0;
        const bReviews = b?.developer?.reputation?.reviewCount ?? b?.rating?.count ?? 0;
        return bReviews - aReviews;
      })
      .slice(0, 4);
  }, [gigsList]);

  return (
    <div className={styles.homePage}>
      <BackgroundBasePlates />
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

      {/* How CodeDript Works - Workflow Steps */}
      <section id="workflow" className={styles.workflowSection}>
        <HeaderText text="How CodeDript Works" subHeader="Simple steps to secure agreements" />
        <WorkFlow />
      </section>

      {/* Top Rated Gigs Section */}
      <section className={styles.gameCardsSection}>
        <div className={styles.gameCardsContainer}>
          <HeaderText text="Trusted by Freelancers Worldwide" subHeader=" " /> 
          <div className={styles.gigCardsGrid}>
            {gigsLoading ? (
              <p>Loading featured gigs...</p>
            ) : gigsError ? (
              <p>Error loading gigs. Please try again later.</p>
            ) : topGigs && topGigs.length > 0 ? (
              topGigs.map((gig: any) => {
                const dev = typeof gig.developer === 'object' ? gig.developer : null;
                const avatar = dev?.avatar || undefined;
                const userName = dev?.fullname || dev?.username || 'Anonymous';
                const skills = Array.isArray(dev?.skills) ? dev.skills.slice(0, 3) : [];
                const gigImage = gig.images && gig.images.length > 0 ? gig.images[0] : undefined;
                const rating = dev?.reputation?.rating ?? gig.rating?.average ?? 0;
                const reviewCount = dev?.reputation?.reviewCount ?? gig.rating?.count ?? 0;
                const basicPackage = Array.isArray(gig.packages)
                  ? (gig.packages.find((p: any) => p.name === 'basic') || gig.packages[0])
                  : undefined;
                const price = basicPackage?.price ?? gig.pricing?.amount ?? 0;
                const currency = basicPackage?.currency ?? gig.pricing?.currency ?? 'USD';

                return (
                  <GigCard
                    key={gig._id}
                    gigId={gig._id}
                    title={gig.title || 'Untitled Gig'}
                    description={gig.description || 'No description available'}
                    rating={rating}
                    reviewCount={reviewCount}
                    userImage={avatar}
                    userName={userName}
                    userRole="Freelance Developer"
                    price={price}
                    currency={currency}
                    skills={skills}
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

      <About />
      <SponsorSection sponsors={sponsors} />      
      <Footer />
      </div>
    </div>
  );
};

export default Home;
