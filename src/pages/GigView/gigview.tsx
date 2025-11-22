import React from 'react';
import styles from './gigview.module.css';
import { useLocation } from 'react-router-dom';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import HeaderText from '../../components/HeaderText/HeaderText';

import GigDetails from '../../components/gigdetails/GigDetails';
import PackageCard from '../../components/card/Package/Package';
import Table from '../../components/table/Table';

interface GigData {
  title?: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
  userImage?: string;
  userName?: string;
  userRole?: string;
  price?: number;
  currency?: string;
  skills?: string[];
  gigImage?: string;
}

const GigView: React.FC = () => {
  const location = useLocation();
  const gigData: GigData = location.state as GigData || {};

  return (
    <div className={styles.container}>
         
      <DeveloperHero 
        userName={gigData.userName}
        userImage={gigData.userImage}
        rating={gigData.rating}
        reviewCount={gigData.reviewCount}
        userRole={gigData.userRole}
        skills={gigData.skills}
        bio={gigData.description}
      />
      <div className={styles.container2}>
       
      <div className={styles.descriptionSection}>
        <div className={styles.titleSection}>
        <h1>{gigData.title || 'Gig Title'}</h1>
        </div>
              {/* Customer Reviews Table Section */}
              <div style={{ margin: '2rem 0' }}>
               
              </div>
        <h2>About this gig</h2>

        <p className={styles.description}>{gigData.description || 'Gig description'}</p>
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
        <Table />
      </div>
  
    </div>
  );
};

export default GigView;
