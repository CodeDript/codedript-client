import React, { useEffect, useState } from 'react';
import styles from './gigview.module.css';
import { useParams } from 'react-router-dom';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import HeaderText from '../../components/HeaderText/HeaderText';
import GigDetails from '../../components/gigdetails/GigDetails';
import PackageCard from '../../components/card/Package/Package';
import Table from '../../components/table/customerTable/Table';
import DeveloperTable from '../../components/table/developerTabale/DeveloperTable';
import UserTable from '../../components/table/userTabale/UserTable';
import { GigService, type Gig } from '../../api/gigService';

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

  return (
    <div className={styles.container}>
         
      <DeveloperHero 
        userName={gig.developer.profile.name || 'Anonymous'}
        userImage={gig.developer.profile.avatar}
        rating={gig.developer.reputation.rating}
        reviewCount={gig.developer.reputation.reviewCount}
        userRole="Freelance Developer"
        skills={gig.developer.profile.skills}
        bio={gig.developer.profile.bio || gig.description}
        memberSince={gig.developer.createdAt}
        walletAddress={gig.developer.walletAddress}
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

      {/* Package Cards Section */}
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '3rem 0' }}>
        <PackageCard
          title="Basic"
          description={["Static analysis", "Basic manual review", "Summary report"]}
          gameId={1}
          price="5300 ETH"
          delivery="14 Days"
          revisions={1}
          buttonLabel="Buy & Escrow"
        />
        <PackageCard
          title="Standard"
          description={["Static analysis", "Basic manual review", "Summary report", "Source file"]}
          gameId={2}
          price="7000 ETH"
          delivery="10 Days"
          revisions={2}
          buttonLabel="Buy & Escrow"
        />
        <PackageCard
          title="Premium"
          description={["Full functional analysis", "Basic manual review", "Summary report", "Source file", "Vector file"]}
          gameId={3}
          price="9500 ETH"
          delivery="07 Days"
          revisions={3}
          buttonLabel="Buy & Escrow"
        />
      </div>
      <UserTable/>
        <DeveloperTable />
        <Table />
      </div>
  
    </div>
  );
};

export default GigView;
