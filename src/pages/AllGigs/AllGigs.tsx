import React, { useState, useMemo } from 'react';
import styles from './AllGigs.module.css';
import HeroSecondary from '../../components/hero/HeroSecondary/HeroSecondary';
import GigCard from '../../components/card/GigCard/GigCard';
import Footer from '../../components/footer/Footer';
import BackgroundBasePlates2 from '../../components/BackgroundBasePlates/BackgroundBasePlates2';

import { useGigs } from '../../query/useGigs';

const AllGigs: React.FC = () => {
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch gigs from API
  const { data, isLoading, error } = useGigs({ page, limit: 20, isActive: true });
  
  const gigs = data?.gigs || [];
  const pagination = data?.pagination;
  const hasMore = pagination ? pagination.page < pagination.pages : false;

  // Client-side filtered list based on search query
  const filteredGigs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return gigs;
    
    const tokens = q.split(/\s+/).filter(Boolean);

    return gigs.filter((gig) => {
      const title = (gig.title || '').toLowerCase();
      const desc = (gig.description || '').toLowerCase();
      const devName = typeof gig.developer === 'object' 
        ? ((gig.developer.fullname || gig.developer.username || '').toLowerCase())
        : '';
      const skills = typeof gig.developer === 'object' && Array.isArray(gig.developer.skills)
        ? gig.developer.skills.map((s: string) => s.toLowerCase()).join(' ')
        : '';

      // All tokens must match somewhere (AND search)
      return tokens.every((tkn) => {
        return title.includes(tkn) || desc.includes(tkn) || skills.includes(tkn) || devName.includes(tkn);
      });
    });
  }, [gigs, searchQuery]);

  return (
 <div className={styles.homePage}>
       <BackgroundBasePlates2 />
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
              <p style={{textAlign: 'center', padding: '2rem', color: '#666'}}>Loading gigs...</p>
            ) : error ? (
              <div style={{textAlign: 'center', padding: '2rem', color: '#ff4444'}}>
                <p>Failed to load gigs.</p>
                <p style={{fontSize: '0.9rem', marginTop: '0.5rem'}}>
                  {error instanceof Error ? error.message : 'Unknown error'}
                </p>
                <p style={{fontSize: '0.8rem', color: '#999', marginTop: '0.5rem'}}>
                  API URL: {import.meta.env.VITE_API_BASE_URL || 'Not configured'}
                </p>
              </div>
            ) : filteredGigs.length > 0 ? (
              filteredGigs.map((gig) => {
                // Extract developer info (API returns populated developer object)
                const dev = typeof gig.developer === 'object' ? gig.developer : null;
                const avatar = dev?.avatar || undefined;
                const userName = dev?.fullname || dev?.username || 'Anonymous';
                const skills = Array.isArray(dev?.skills) ? dev.skills.slice(0, 3) : [];
                
                // Get first image from images array
                const gigImage = gig.images && gig.images.length > 0 ? gig.images[0] : undefined;
                
                // Get pricing from first package (basic)
                const basicPackage = gig.packages.find(p => p.name === 'basic') || gig.packages[0];
                const price = basicPackage?.price || 0;

                return (
                  <GigCard 
                    key={gig._id}
                    gigId={gig._id}
                    title={gig.title || 'Untitled Gig'}
                    description={gig.description || 'No description available'}
                    rating={0}
                    reviewCount={0}
                    userImage={avatar}
                    userName={userName}
                    userRole="Freelance Developer"
                    price={price}
                    currency="USD"
                    skills={skills}
                    gigImage={gigImage}
                  />
                );
              })
            ) : (
              <p style={{textAlign: 'center', padding: '2rem', color: '#666', gridColumn: '1 / -1'}}>No gigs available at the moment.</p>
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
