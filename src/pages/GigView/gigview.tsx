import React from 'react';
import styles from './gigview.module.css';
import { useLocation } from 'react-router-dom';
import DeveloperHero from '../../components/hero/DeveloperHero/DeveloperHero';
import HeaderText from '../../components/HeaderText/HeaderText';

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
        <h2>About this gig</h2>

        <p className={styles.description}>{gigData.description || 'Gig description'}</p>
      </div>
      <div className={styles.detailsSection}>
        <h2>Gig Details</h2>
        <div className={styles.details}>
          <p><strong>Rating:</strong> {gigData.rating || 'N/A'} ({gigData.reviewCount || 0} reviews)</p>
          <p><strong>Developer:</strong> {gigData.userName || 'Unknown'} ({gigData.userRole || 'Role'})</p>
          <p><strong>Price:</strong> {gigData.price || 'N/A'} {gigData.currency || 'ETH'}</p>
          <p><strong>Skills:</strong> {gigData.skills?.join(', ') || 'None'}</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default GigView;
