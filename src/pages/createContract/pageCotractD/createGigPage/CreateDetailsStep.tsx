import React, { useState, useEffect } from 'react';
import styles from '../pageCotractD.module.css';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
};

const CreateDetailsStep: React.FC<Props> = ({ title, setTitle, description, setDescription }) => {
  const [category, setCategory] = useState<string>('');
  
  return (
    <>
      <h4 className={styles.sectionTitle}>Gig Details</h4>
      <h4 className={styles.step}>Step 1 of 4</h4>
      <section className={`${styles.cardArea2} ${styles.sectionTopPadding}`}>
        <div className={styles.formRow}>
          <label className={styles.zenThin} htmlFor="gig-title">Project Title :</label>
          <input id="gig-title" aria-label="Gig title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label className={styles.zenThin} htmlFor="gig-description">Project Description :</label>
          <textarea id="gig-description" aria-label="Gig description" value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} />
        </div>

      </section>
    </>
  );
};

export default CreateDetailsStep;
