import React, { useState, useEffect } from 'react';
import styles from './DeveloperHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/heroOutline.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import hierarchyIcon from '../../../assets/svg/hierarchy.svg';
import starIcon from '../../../assets/svg/starIcon.svg';
import Button4Black2 from '../../button/Button4Black2/Button4Black2';
import { ApiService } from '../../../services/apiService';
import type { User } from '../../../types';

interface DeveloperHeroProps {
  userName?: string;
  userImage?: string;
  rating?: number;
  reviewCount?: number;
  userRole?: string;
  skills?: string[];
  bio?: string;
}

const DeveloperHero: React.FC<DeveloperHeroProps> = ({
  userName = 'Sia Croven',
  userImage = 'https://i.pravatar.cc/150?img=47',
  rating = 4.9,
  reviewCount = 127,
  userRole = 'Freelance Developer',
  skills = ['React', 'Smart Contract', 'Node.js', 'TypeScript'],
  bio = 'Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development. Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development. Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development.'
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await ApiService.get<User>('/auth/me');
        setUser(res.data);
      } catch (err: any) {
        console.error('Failed to fetch user in DeveloperHero:', err);
        setError(err?.message || 'Failed to load user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const displayName = isLoading ? 'Loading...' : (user?.profile?.name ?? 'Pending');
  const displayImage = user?.profile?.avatar ?? userImage;
  const displayRating = isLoading ? null : (user?.reputation?.rating ?? null);
  const displayReviewCount = isLoading ? null : (user?.reputation?.reviewCount ?? null);
  const displayRole = isLoading ? 'Loading...' : (user?.role === 'both' ? 'Freelance Client & Developer' : (user?.role === 'developer' ? 'Freelance Developer' : (user?.role === 'client' ? 'Freelance Client' : 'Pending')));
  const displaySkills = isLoading ? [] : (user?.profile?.skills && user.profile.skills.length ? user.profile.skills : ['Pending']);
  const displayBio = isLoading ? 'Loading...' : (user?.profile?.bio ?? 'Pending');
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  const formatWalletAddress = (address?: string) => {
    if (!address) return 'Pending';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const displayWallet = isLoading ? 'Loading...' : (user?.walletAddress ? formatWalletAddress(user.walletAddress) : 'Pending');

  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>{displayRole.includes('Freelance') ? 'Freelancer' : 'Client'}</p>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img 
              src={displayImage} 
              alt="Developer profile" 
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{displayName}</h2>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <img src={starIcon} alt="rating" className={styles.metaIcon} />
                  <span className={styles.metaText}>{displayRating} ({displayReviewCount} reviews)</span>
                </div>
                <div className={styles.metaItem}>
                  <img src={hierarchyIcon} alt="level" className={styles.metaIcon} />
                  <span className={styles.metaText}>Level 2 Seller</span>
                </div>
                <div className={styles.metaItem}>
                  <img src={calenderIcon} alt="member since" className={styles.metaIcon} />
                  <span className={styles.metaText}>{formatMemberSince(user?.createdAt)}</span>
                </div>
              </div>
              <p className={styles.title}>{displayRole}</p>
              <p className={styles.earnings}>{displayWallet}</p>
              <p className={styles.bio}>
                {displayBio}
              </p>
            </div>
          </div>
          
     
        </div>
         <div className={styles.skillsBase}>
             <div className={styles.skills}>
            {displaySkills.map((skill, index) => (
              <Button4Black2 key={index} text={skill} className={styles.skillButton} />
            ))}
          </div>
      </div>
      </div>
    </section>
  );
};

export default DeveloperHero;
