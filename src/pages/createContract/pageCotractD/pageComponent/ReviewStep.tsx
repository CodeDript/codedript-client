import React from 'react';
import styles from '../pageCotractD.module.css';

type Milestone = { title: string };

type Props = {
  title: string;
  description: string;
  developerWallet?: string;
  developerReceivingAddress?: string;
  clientName: string;
  clientEmail: string;
  value: string;
  currency: string;
  deadline: string;
  milestones: Milestone[];
  filesNote: string;
  isClientView?: boolean;
};

const ReviewStep: React.FC<Props> = ({ title, description, developerWallet, developerReceivingAddress, clientName, clientEmail, value, currency, deadline, milestones, filesNote, isClientView }) => {
  const [approved, setApproved] = React.useState(false);

  // Expose approved state to parent via callback
  React.useEffect(() => {
    if (isClientView && (window as any).__setClientApproved) {
      (window as any).__setClientApproved(approved);
    }
  }, [approved, isClientView]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Review</h4>
      <h4 className={styles.step}>Step 5 of 5</h4>

      <div className={styles.cardArea2}>
        <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'Jura', fontWeight: 500}}>Project Details</div>
        <div className={styles.reviewBox}>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Title :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{title}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Description :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{description}</div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Value :</div>
            <div className={styles.reviewValue}>
              <span className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{value}</span>
              <span style={{marginLeft:6, fontFamily: 'Jura'}}>{currency}</span>
            </div>
          </div>
          <div className={styles.reviewRow}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Deadline :</div>
            <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{deadline}</div>
          </div>
        </div>

        <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'Jura', fontWeight: 500}}>Parties</div>
        <div className={styles.reviewBox}>
          <div style={{display:'flex', justifyContent:'space-between', gap:12}}>
            <div style={{flex:1, marginRight:12}}>
              <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Client</div>
              <div className={`${styles.reviewValueLarge}`}>{clientName}</div>
              <div style={{fontSize:'0.9rem', color:'#666'}}>{clientEmail}</div>
            </div>

            <div style={{flex:1}}>
              <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Developer</div>
              <div className={`${styles.reviewValueLarge}`}>{developerReceivingAddress || developerWallet || 'No receiving address'}</div>
            </div>
          </div>
        </div>

        <div className={styles.juraTitle} style={{marginTop: '20px'}}>Milestone Breakdown</div>
        <div className={styles.reviewBox}>
          <div style={{marginTop:8}}>
            {milestones.map((m, i) => (
              <div key={i} className={styles.reviewRow}>
                <div className={styles.reviewValue} style={{fontFamily: 'Jura'}}>{m.title}</div>
              </div>
            ))}
          </div>
          <div className={styles.reviewRow} style={{marginTop:12}}>
            <div className={styles.reviewKey} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Total</div>
            <div className={`${styles.totalPrice}`}>{value} {currency}</div>
          </div>
        </div>

        {filesNote && (
          <div style={{marginTop:20}}>
            <div className={styles.juraTitle} style={{fontFamily: 'Zen Dots', fontWeight: 100}}>Additional Terms</div>
            <div style={{padding:10, border:'1px solid #eee', marginTop:6, fontFamily:'Jura', fontSize:'16px'}} className={styles.reviewValue}>{filesNote}</div>
          </div>
        )}

        {isClientView && (
          <div style={{marginTop:16, display:'flex', gap:8, alignItems:'center'}}>
            <input 
              id="clientApprove" 
              type="checkbox" 
              checked={approved} 
              onChange={(e) => setApproved(e.target.checked)} 
            />
            <label htmlFor="clientApprove" style={{fontFamily:'Jura'}}>
              I approve these payment terms and agree to pay {value} {currency} to the smart contract escrow
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewStep;
