import React from 'react';
import styles from './DeveloperHero.module.css';
// heroGrid removed — not used in this variant
import heroOutline from '../../../assets/svg/heroOutline.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import hierarchyIcon from '../../../assets/svg/hierarchy.svg';
import starIcon from '../../../assets/svg/starIcon.svg';
import Button4Black2 from '../../button/Button4Black2/Button4Black2';

const DeveloperHero: React.FC = () => {
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
              src="https://i.pravatar.cc/150?img=47" 
              alt="Developer profile" 
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>Sia Croven</h2>
              <div className={styles.profileMeta}>
                <div className={styles.metaItem}>
                  <img src={starIcon} alt="rating" className={styles.metaIcon} />
                  <span className={styles.metaText}>4.9 (127 reviews)</span>
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
              <p className={styles.title}>Freelance Developer</p>
              <p className={styles.earnings}>233...e998</p>
              <p className={styles.bio}>
                Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development. Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development. Full Stack Developer with 5+ years experience in React, Node.js, and Blockchain development.
              </p>
            </div>
          </div>
          
     
        </div>
         <div className={styles.skillsBase}>
             <div className={styles.skills}>
            <Button4Black2 text="React" className={styles.skillButton} />
            <Button4Black2 text="Smart Contract" className={styles.skillButton} />
            <Button4Black2 text="Node.js" className={styles.skillButton} />
            <Button4Black2 text="TypeScript" className={styles.skillButton} />
          </div>
      </div>
      </div>
    </section>
  );
};

export default DeveloperHero;
