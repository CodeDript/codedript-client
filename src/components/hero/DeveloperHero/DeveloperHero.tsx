import React from 'react';
import styles from './DeveloperHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/heroOutline.svg';
import userPlaceholder from '../../../assets/svg/user-placeholder.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import hierarchyIcon from '../../../assets/svg/hierarchy.svg';
import starIcon from '../../../assets/svg/starIcon.svg';
import Button4Black2 from '../../button/Button4Black2/Button4Black2';

interface DeveloperHeroProps {
  userName?: string;
  userImage?: string;
  rating?: number;
  reviewCount?: number;
  userRole?: string;
  skills?: string[];
  bio?: string;
  memberSince?: string;
  walletAddress?: string;
}

const DeveloperHero: React.FC<DeveloperHeroProps> = ({
  userName = 'Sia Croven',
  userImage = userPlaceholder,
  rating = 4.9,
  reviewCount = 127,
  userRole = 'Freelance Developer',
  skills = ['React', 'Smart Contract', 'Node.js', 'TypeScript'],
  bio = 'Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development.',
  memberSince,
  walletAddress
}) => {
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Member since 2024';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  const formatWalletAddress = (address?: string) => {
    if (!address) return 'Wallet not connected';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        {/* show Developer when role suggests developer/freelance, otherwise Client */}
        <p className={styles.overline}>{
          (() => {
            const role = (userRole || '').toString().toLowerCase();
            if (role.includes('developer') || role.includes('dev') || role.includes('freelance')) return 'Developer';
            return 'Client';
          })()
        }</p>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarFrame}>
              <img
                src={userImage}
                alt="Developer profile"
                className={styles.avatarImg}
                onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = userPlaceholder; }}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{userName}</h2>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <img src={starIcon} alt="rating" className={styles.metaIcon} />
                  <span className={styles.metaText}>{rating} ({reviewCount} reviews)</span>
                </div>
                <div className={styles.metaItem}>
                  <img src={hierarchyIcon} alt="level" className={styles.metaIcon} />
                  <span className={styles.metaText}>Level 2 Seller</span>
                </div>
                <div className={styles.metaItem}>
                  <img src={calenderIcon} alt="member since" className={styles.metaIcon} />
                  <span className={styles.metaText}>{formatMemberSince(memberSince)}</span>
                </div>
              </div>
              <p className={styles.title}>{userRole}</p>
              <p className={styles.earnings}>{formatWalletAddress(walletAddress)}</p>
              <p className={styles.bio}>
                {bio}
              </p>
            </div>
          </div>
          
     
        </div>
         <div className={styles.skillsBase}>
            <div className={styles.skills}>
             {skills.slice(0, 4).map((skill, index) => (
               <Button4Black2 key={index} text={skill} className={styles.skillButton} />
             ))}
             
          </div>
      </div>
      </div>
    </section>
  );
};

export default DeveloperHero;
