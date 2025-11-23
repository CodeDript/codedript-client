import React, { useEffect, useState } from 'react';
import styles from './AllGigs.module.css';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import GigCard from '../../components/card/GigCard/GigCard';
import Footer from '../../components/footer/Footer';
import { GigService, type Gig } from '../../api/gigService';

const AllGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const response = await GigService.getRecentGigs(page, 10);
        setGigs(response.data);
        setHasMore(response.pagination.page < response.pagination.totalPages);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch gigs:', err);
        setError('Failed to load gigs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, [page]);

  return (
 <div className={styles.homePage}>
       <HeroSecondary />  
     
      <section className={styles.gameCardsSection}>
        <div className={styles.gameCardsContainer}>
          
          <div className={styles.gigCardsGrid}>
            {isLoading ? (
              <p>Loading gigs...</p>
            ) : error ? (
              <p>Error loading gigs. Please try again later.</p>
            ) : gigs.length > 0 ? (
              gigs.map((gig) => (
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
     <Footer />
    </div>
  );
};


export default AllGigs;
