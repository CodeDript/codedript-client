import React from 'react';
import styles from './UserHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/black base.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import hierarchyIcon from '../../../assets/svg/hierarchy.svg';
import starIcon from '../../../assets/svg/starIcon.svg';
import Button4Black2 from '../../button/Button4Black2/Button4Black2';

const UserHero: React.FC = () => {
  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>Client</p>
        
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <img 
              src="https://i.pravatar.cc/150?img=47" 
              alt="Client profile" 
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>Sia Croven</h2>
              <div className={styles.profileMeta}>
                
                <div className={styles.metaItem}>
                  <img src={calenderIcon} alt="member since" className={styles.metaIcon} />
                  <span className={styles.metaText}>Member since Jan 2025</span>
                </div>
              </div>
              <p className={styles.title}>Freelance Client</p>
              <p className={styles.earnings}>233...e99348</p>
              <p className={styles.bio}>
                Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development. 
              </p>
            </div>
          </div>
          
     
        </div>
     
      </div>
    </section>
  );
};

export default UserHero;
