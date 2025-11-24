import React, { useEffect, useState } from 'react';
import styles from './AllGigs.module.css';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import GigCard from '../../components/card/GigCard/GigCard';
import Footer from '../../components/footer/Footer';
import { GigService, type Gig } from '../../api/gigService';
import { ApiService } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import Button1 from '../../components/button/Button1/Button1';

const AllGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        const response = await GigService.getRecentGigs(page, 10);
        let fetchedGigs = response.data as Gig[];

        // If developer is not populated (string id), fetch developer profiles for those gigs
        const developerIdsToFetch: string[] = [];
        fetchedGigs.forEach(g => {
          if (g && g.developer && typeof g.developer === 'string') {
            developerIdsToFetch.push(g.developer as unknown as string);
          } else if (g && g.developer && !(g.developer as any).profile) {
            // developer exists but not populated
            const maybeId = (g.developer as any)._id || (g.developer as any).toString();
            if (maybeId) developerIdsToFetch.push(maybeId);
          }
        });

        if (developerIdsToFetch.length > 0) {
          // fetch unique ids
          const uniqueIds = Array.from(new Set(developerIdsToFetch));
          const devPromises = uniqueIds.map(id => ApiService.get(`/users/${id}`).then(r => ({ id, data: r.data })).catch(() => null));
          const devResults = await Promise.all(devPromises);
          const devMap = new Map<string, any>();
          devResults.forEach(res => { if (res && res.id) devMap.set(res.id, res.data); });

          // attach developer objects
          fetchedGigs = fetchedGigs.map(g => {
            try {
              const devField: any = g.developer as any;
              const id = typeof devField === 'string' ? devField : (devField && devField._id) ? devField._id : null;
              if (id && devMap.has(id)) {
                return { ...g, developer: devMap.get(id) } as Gig;
              }
            } catch (e) {}
            return g;
          });
        }

        // append when loading additional pages
        setGigs((prev) => (page === 1 ? fetchedGigs : [...prev, ...fetchedGigs]));
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
              gigs.map((gig) => {
                // Defensive checks for null/undefined developer or profile
                const dev = gig.developer || { profile: {}, reputation: { rating: 0, reviewCount: 0 } };
                const profile = dev.profile || {};
                const avatar = profile.avatar || undefined;
                const gigImage = (gig.images && gig.images[0] && gig.images[0].url) || undefined;

                const ratingValue = (dev.reputation && typeof dev.reputation.rating === 'number')
                  ? dev.reputation.rating
                  : (gig.rating?.average ?? 0);
                const reviewCountValue = (dev.reputation && typeof dev.reputation.reviewCount === 'number')
                  ? dev.reputation.reviewCount
                  : (gig.rating?.count ?? 0);

                return (
                  <GigCard 
                    key={gig._id}
                    gigId={gig._id}
                    title={gig.title || 'Untitled Gig'}
                    description={gig.description || 'No description available'}
                    rating={Math.round(ratingValue) ?? 0}
                    reviewCount={reviewCountValue ?? 0}
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
          {/* load more and create gig buttons */}
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:20, gap:12}}>
            <div>
              {(hasMore || isLoading) && (
                <button
                  className={styles.loadMoreBtn}
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading || !hasMore}
                  style={{padding:'10px 18px', borderRadius:8, border:'1px solid #111', background:'#111', color:'#fff', cursor: isLoading || !hasMore ? 'not-allowed' : 'pointer'}}
                >
                  {isLoading ? 'Loading...' : 'Load more'}
                </button>
              )}
            </div>
            <div>
              <Button1 text="Create Gige" onClick={() => navigate('/create-gig')} />
            </div>
          </div>
        </div>
      </section>
     <Footer />
    </div>
  );
};


export default AllGigs;
