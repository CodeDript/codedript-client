import React from 'react';
import styles from './DeveloperHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/heroOutline.svg';
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
  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>Freelancer</p>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img 
              src={userImage} 
              alt="Developer profile" 
              className={styles.profileImage}
            />
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
                  <span className={styles.metaText}>Member since Jan 2025</span>
                </div>
              </div>
              <p className={styles.title}>{userRole}</p>
              <p className={styles.earnings}>233...e998</p>
              <p className={styles.bio}>
                {bio}
              </p>
            </div>
          </div>
          
     
        </div>
         <div className={styles.skillsBase}>
             <div className={styles.skills}>
            {skills.map((skill, index) => (
              <Button4Black2 key={index} text={skill} className={styles.skillButton} />
            ))}
          </div>
      </div>
      </div>
    </section>
  );
};

export default DeveloperHero;
