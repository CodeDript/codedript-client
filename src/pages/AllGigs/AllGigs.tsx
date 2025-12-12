import React, { useEffect, useState, useMemo } from 'react';
import styles from './AllGigs.module.css';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import GigCard from '../../components/card/GigCard/GigCard';
import Footer from '../../components/footer/Footer';
import { getRecentGigs, type MockGig as Gig } from '../../mockData/gigData';
import { useNavigate } from 'react-router-dom';
import Button1 from '../../components/button/Button1/Button1';

const AllGigs: React.FC = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = getRecentGigs(page, 10);
        const fetchedGigs = response.data as Gig[];

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

  // debounce search input for better performance
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Client-side filtered list based on debounced query
  const filteredGigs = useMemo(() => {
    const q = (debouncedQuery || '').toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);

    return gigs.filter((gig) => {
      if (tokens.length === 0) return true;

      // aggregate searchable text
      const title = (gig.title || '').toLowerCase();
      const desc = (gig.description || '').toLowerCase();
      const devName = (gig.developer && (gig.developer as any).profile && (gig.developer as any).profile.name)
        ? ((gig.developer as any).profile.name as string).toLowerCase()
        : '';
      const skills = Array.isArray((gig.developer as any)?.profile?.skills)
        ? (gig.developer as any).profile.skills.map((s: string) => s.toLowerCase()).join(' ')
        : '';

      // All tokens must match somewhere (AND search)
      return tokens.every((tkn) => {
        return title.includes(tkn) || desc.includes(tkn) || skills.includes(tkn) || devName.includes(tkn);
      });
    });
  }, [gigs, debouncedQuery]);

  return (
 <div className={styles.homePage}>
       <HeroSecondary />  
     
      <section className={styles.gameCardsSection}>
        <div className={styles.gameCardsContainer}>
          
          {/* Search bar */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search gigs by title, description or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {/* single search input only; filtering runs automatically */}
          </div>

          <div className={styles.gigCardsGrid}>
            {isLoading ? (
              <p>Loading gigs...</p>
            ) : error ? (
              <p></p>
            ) : filteredGigs.length > 0 ? (
              filteredGigs.map((gig) => {
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
              null
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
             
            </div>
          </div>
        </div>
      </section>
     <Footer />
    </div>
  );
};


export default AllGigs;
