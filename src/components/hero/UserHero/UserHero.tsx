import React, { useState, useEffect } from 'react';
import styles from './UserHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/black base.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import hierarchyIcon from '../../../assets/svg/hierarchy.svg';
import starIcon from '../../../assets/svg/starIcon.svg';
import Button4Black2 from '../../button/Button4Black2/Button4Black2';
import { ApiService } from '../../../services/apiService';
import type { User } from '../../../types';

const UserHero: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.get<User>('/auth/me');
        setUser(response.data);
      } catch (err: any) {
        console.error('Failed to fetch user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Format wallet address for display
  const formatWalletAddress = (address: string | undefined) => {
    if (!address) return 'Pending';
    return `${address.slice(0, 5)}...${address.slice(-6)}`;
  };

  // Format member since date
  const formatMemberSince = (dateString: string | undefined) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>
          {user?.role === 'both' ? 'Client & Developer' : user?.role === 'developer' ? 'Developer' : 'Client'}
        </p>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img 
              src={user?.profile?.avatar || "https://i.pravatar.cc/150?img=47"} 
              alt="Client profile" 
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {isLoading ? 'Loading...' : (user?.profile?.name || 'Pending')}
              </h2>
              <div className={styles.profileMeta}>
                
                <div className={styles.metaItem}>
                  <img src={calenderIcon} alt="member since" className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {formatMemberSince(user?.createdAt)}
                  </span>
                </div>
              </div>
              <p className={styles.title}>
                {user?.role === 'both' ? 'Freelance Client & Developer' : user?.role === 'developer' ? 'Developer' : 'Client'}
              </p>
              <p className={styles.earnings}>
                {formatWalletAddress(user?.walletAddress)}
              </p>
              <p className={styles.bio}>
                {user?.profile?.bio || 'Pending'}
              </p>
            </div>
          </div>
          
     
        </div>
     
      </div>
    </section>
  );
};

export default UserHero;
