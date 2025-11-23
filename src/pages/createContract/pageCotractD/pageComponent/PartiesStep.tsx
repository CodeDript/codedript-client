import React from 'react';
import styles from '../pageCotractD.module.css';

type Props = {
  clientName: string;
  setClientName: (v: string) => void;
  clientEmail: string;
  setClientEmail: (v: string) => void;
  clientWallet: string;
  setClientWallet: (v: string) => void;
  developerName: string;
  developerEmail: string;
  developerWallet: string;
};

const PartiesStep: React.FC<Props> = ({ clientName, setClientName, clientEmail, setClientEmail, clientWallet, setClientWallet, developerName, developerEmail, developerWallet }) => {
  return (
    <>
      <h4 className={styles.sectionTitle}>Parties</h4>
      <h4 className={styles.step}>Step 2 of 5</h4>

      <div className={styles.cardArea2}>
        <div className={styles.formRow}>
          <label>Client Name :</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label>Client Email :</label>
          <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        </div>

        <div className={styles.formRow}>
          <label>Client Wallet Address (optional):</label>
          <input value={clientWallet} onChange={(e) => setClientWallet(e.target.value)} />
        </div>

        {/* Developer read-only preview (prefill) */}
        <div style={{marginTop:12}} className={styles.formRow}>
          <label>Developer</label>
          <div style={{background:'#efefef', padding:'10px', borderRadius:6}}>
            <div style={{fontWeight:700}}>{developerName}</div>
            <div style={{fontSize:'0.9rem', color:'#666'}}>{developerEmail}</div>
            <div style={{fontSize:'0.85rem', color:'#888', marginTop:6}}>{developerWallet}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PartiesStep;
