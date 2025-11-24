import React from 'react';
import styles from '../pageCotractD.module.css';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  developerReceivingAddress: string;
  setDeveloperReceivingAddress: (v: string) => void;
};

const DetailsStep: React.FC<Props> = ({ title, setTitle, description, setDescription, developerReceivingAddress, setDeveloperReceivingAddress }) => {
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
          <label className={styles.zenThin}>Developer Receiving Ethereum Address :</label>
          <input value={developerReceivingAddress} onChange={(e)=>setDeveloperReceivingAddress(e.target.value)} placeholder="Enter receiving address (e.g. 0x...)" />
        </div>
      </section>
    </>
  );
};

export default DetailsStep;
