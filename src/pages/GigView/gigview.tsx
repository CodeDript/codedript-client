import React, { useEffect, useState } from 'react';
import styles from './gigview.module.css';
import { useParams } from 'react-router-dom';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import GigDetails from '../../components/gigdetails/GigDetails';
import PackageCard from '../../components/card/Package/Package';
import Table from '../../components/table/customerTable/Table';
import { GigService, type Gig } from '../../api/gigService';
import Footer from '../../components/footer/Footer';
import BackgroundBasePlates2 from '../../components/BackgroundBasePlates/BackgroundBasePlates2';

const GigView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGig = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const gigData = await GigService.getGigById(id);
        setGig(gigData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch gig:', err);
        setError('Failed to load gig details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  if (isLoading) {
    return <div className={styles.container}><p>Loading gig details...</p></div>;
  }

  if (error || !gig) {
    return <div className={styles.container}><p>{error || 'Gig not found'}</p></div>;
  }

  // Defensive checks for developer data
  const developer = gig.developer || {};
  const profile = developer.profile || {};
  const reputation = developer.reputation || { rating: 0, reviewCount: 0 };

  return (
    <div className={styles.container}>
         <BackgroundBasePlates2 />
      <DeveloperHero 
        userName={profile.name || 'Anonymous'}
        userImage={profile.avatar || undefined}
        rating={reputation.rating || 0}
        reviewCount={reputation.reviewCount || 0}
        userRole="Freelance Developer"
        skills={Array.isArray(profile.skills) ? profile.skills : []}
        bio={profile.bio || gig.description || 'No bio available'}
        memberSince={developer.createdAt || new Date().toISOString()}
        walletAddress={developer.walletAddress || 'N/A'}
      />
      <div className={styles.container2}>
       
      <div className={styles.descriptionSection}>
        <div className={styles.titleSection}>
        <h1>{gig.title}</h1>
        </div>
              {/* Customer Reviews Table Section */}
              <div style={{ margin: '2rem 0' }}>
               
              </div>
        <h2>About this gig</h2>

        <p className={styles.description}>{gig.description}</p>
      </div>
      <div className={styles.detailsSection}>
        <h2>Gig Details</h2>
        <div className={styles.details}>
          <GigDetails />
        </div>
      </div>
 <div className={styles.descriptionSection}>
        <div className={styles.titleSection}>
      
        </div>
              {/* Customer Reviews Table Section */}
              <div style={{ margin: '2rem 0' }}>
               
              </div>
        <h2>About this gig packages</h2>

        <p className={styles.description}>Basic Package (1800 USD)

Perfect for startups needing a solid chat system. Includes real-time messaging, authentication, and core chat features. Fast delivery with essential functionalities.

Standard Package (3500 USD)

Ideal for growing communities and teams. Adds group chats, file sharing, voice calling, and typing indicators. A balanced upgrade with powerful communication tools.

Premium Package (6000 USD)

Best for businesses needing a full communication suite. Includes HD calling, screen share, encryption, and conference features. Packed with automation and advanced admin controls. </p>
      </div>
      <div className={styles.detailsSection}>
     </div>
      {/* Package Cards Section */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '3rem 0' }}>
        {gig.packages && gig.packages.length > 0 && (
          gig.packages.map((pkg, index) => {
            const name = (pkg.name || '').toString().toLowerCase();
            let description = (pkg.features || []).slice(0, 5);
            let priceStr = `${pkg.price || 0} ${pkg.currency || 'USD'}`;

            if (name.includes('basic')) {
              priceStr = '1800 USD';
              description = [
                'Perfect for startups needing a solid chat system.',
                'Includes real-time messaging, authentication, and core chat features.',
                'Fast delivery with essential functionalities.'
              ];
            } else if (name.includes('standard')) {
              priceStr = '3500 USD';
              description = [
                'Ideal for growing communities and teams.',
                'Adds group chats, file sharing, voice calling, and typing indicators.',
                'A balanced upgrade with powerful communication tools.'
              ];
            } else if (name.includes('premium')) {
              priceStr = '6000 USD';
              description = [
                'Best for businesses needing a full communication suite.',
                'Includes HD calling, screen share, encryption, and conference features.',
                'Packed with automation and advanced admin controls.'
              ];
            }

            return (
              <PackageCard
                key={index}
                title={pkg.name || 'Package'}
                description={description}
                gameId={index + 1}
                price={priceStr}
                delivery={`${pkg.deliveryTime || 0} Days`}
                revisions={pkg.revisions || 0}
                buttonLabel="Buy & Escrow"
                gigId={gig._id}
                developerWallet={developer.walletAddress}
              />
            );
          })
        )}
      </div>
      
      <div className={styles.descriptionSection}>
        <div className={styles.titleSection}>
     
        </div>
              {/* Customer Reviews Table Section */}
              <div style={{ margin: '2rem 0' }}>
               
              </div>
        <h2>Customer Reviews section</h2>

     
      </div>
      <div className={styles.detailsSection}>
     </div>
      {/* Customer Reviews Section */}
      <div style={{ margin: '3rem 0' }}>
        <h2>Customer Reviews section</h2>
        {developer._id && <Table developerId={developer._id} />}
      </div>
      </div>
      <Footer />
    </div>
    );
};

export default GigView;

