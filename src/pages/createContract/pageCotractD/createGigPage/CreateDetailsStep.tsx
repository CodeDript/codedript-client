import React, { useState, useEffect } from 'react';
import styles from '../pageCotractD.module.css';
import { useAgreement } from '../../../../context/AgreementContext';

type Props = {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  developerReceivingAddress: string;
  setDeveloperReceivingAddress: (v: string) => void;
};

const CreateDetailsStep: React.FC<Props> = ({ title, setTitle, description, setDescription, developerReceivingAddress, setDeveloperReceivingAddress }) => {
  const { formData, updateFormData } = useAgreement();
  const [category, setCategory] = useState<string>(formData?.gigData?.category || '');

  useEffect(() => {
    // keep context in sync when category or receiving address changes
    const newGigData = { ...(formData.gigData || {}), category } as any;
    updateFormData({ 
      gigData: newGigData,
      developerReceivingAddress
    });
  }, [category, developerReceivingAddress]);
  
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

        <div className={styles.formRow}>
          <label className={styles.zenThin} htmlFor="gig-category">Category :</label>
          <input id="gig-category" aria-label="Gig category" value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Enter category (e.g. Web Development)" />
        </div>

        <div className={styles.formRow}>
          <label className={styles.zenThin} htmlFor="developer-receiving">Developer Receiving Ethereum Address :</label>
          <input id="developer-receiving" aria-label="Developer receiving ethereum address" value={developerReceivingAddress} onChange={(e)=>setDeveloperReceivingAddress(e.target.value)} placeholder="Enter receiving address (e.g. 0x...)" />
        </div>
      </section>
    </>
  );
};

export default CreateDetailsStep;
