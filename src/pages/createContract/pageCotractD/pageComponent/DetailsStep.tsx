import React from 'react';
import styles from '../pageCotractD.module.css';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  developerId: string;
  setDeveloperId: (v: string) => void;
};

const DetailsStep: React.FC<Props> = ({ title, setTitle, description, setDescription, developerId, setDeveloperId }) => {
  return (
    <>
      <h4 className={styles.sectionTitle}>Project Details</h4>
      <h4 className={styles.step}>Step 1 of 5</h4>
      <section className={`${styles.cardArea2} ${styles.sectionTopPadding}`}>
        <div className={styles.formRow}>
          <label className={styles.zenThin}>Project Title :</label>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label className={styles.zenThin}>Project Description :</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} rows={4} />
        </div>

        <div className={styles.formRow}>
          <label className={styles.zenThin}>Developer ID :</label>
          <input value={developerId} onChange={(e)=>setDeveloperId(e.target.value)} />
        </div>
      </section>
    </>
  );
};

export default DetailsStep;
