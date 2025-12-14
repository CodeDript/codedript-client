import React from 'react';
import styles from './gigview.module.css';
import { useParams } from 'react-router-dom';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import GigDetails from '../../components/gigdetails/GigDetails';
import PackageCard from '../../components/card/Package/Package';
import Table from '../../components/table/customerTable/Table';
import { useGig } from '../../query/useGigs';
import Footer from '../../components/footer/Footer';

const GigView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Fetch gig from API
  const { data: gig, isLoading, error } = useGig(id || '');

  if (isLoading) {
    return <div className={styles.container}><p style={{textAlign: 'center', padding: '2rem'}}>Loading gig details...</p></div>;
  }

  if (error || !gig) {
    return <div className={styles.container}><p style={{textAlign: 'center', padding: '2rem', color: '#ff4444'}}>{error instanceof Error ? error.message : 'Gig not found'}</p></div>;
  }

  // Extract developer data from API response
  const developer = typeof gig.developer === 'object' ? gig.developer : null;
  const developerName = developer?.fullname || developer?.username || 'Anonymous';
  const developerAvatar = developer?.avatar || undefined;
  const developerSkills = Array.isArray(developer?.skills) ? developer.skills : [];
  const developerBio = developer?.bio || gig.description || 'No bio available';
  const developerWallet = developer?.walletAddress || 'N/A';
  const developerId = developer?._id || '';

  return (
    <div className={styles.container}>
         
      <DeveloperHero 
        userName={developerName}
        userImage={developerAvatar}
        rating={0}
        reviewCount={0}
        userRole="Freelance Developer"
        skills={developerSkills}
        bio={developerBio}
        memberSince={gig.createdAt}
        walletAddress={developerWallet}
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
            <GigDetails images={gig.images} />
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
            // Use actual package data from API
            const packageFeatures = Array.isArray(pkg.features) ? pkg.features : [];
            const packageDescription = pkg.description || '';
            const displayDescription = packageFeatures.length > 0 ? packageFeatures : [packageDescription];
            
            return (
              <PackageCard
                key={`${pkg.name || 'pkg'}-${index}`}
                title={pkg.name || 'Package'}
                description={displayDescription}
                gameId={index + 1}
                price={`${pkg.price || 0} ETH`}
                delivery={`${pkg.deliveryTime || 0} days`}
                revisions={0}
                buttonLabel="Buy & Escrow"
                gigId={gig._id}
                developerWallet={developerWallet}
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
        {developerId && <Table developerId={developerId} />}
      </div>
      </div>
      <Footer />
    </div>
    );
};

export default GigView;

