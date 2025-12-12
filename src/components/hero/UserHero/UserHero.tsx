import React, { useState, useEffect } from 'react';
import styles from './UserHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/black base.svg';
import calenderIcon from '../../../assets/svg/calander.svg';

interface User {
  _id: string;
  email: string;
  role: string;
  walletAddress: string;
  profile: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: string;
}

const UserHero: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data - in a real app, this would come from auth context
        const mockUser: User = {
          _id: 'client-001',
          email: 'john.client@example.com',
          role: 'client',
          walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          profile: {
            name: 'John Client',
            avatar: 'https://i.pravatar.cc/150?img=11',
          },
          createdAt: '2023-01-10T00:00:00Z',
        } as User;
        
        setUser(mockUser);
      } catch (err: any) {
        console.error('Failed to fetch user data:', err);
      } finally{
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
