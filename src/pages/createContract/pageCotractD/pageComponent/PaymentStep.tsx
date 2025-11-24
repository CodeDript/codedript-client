import React from 'react';
import styles from '../pageCotractD.module.css';
import downloadIcon from '../../../../assets/svg/downloard-files.svg';

type Milestone = { title: string; amount: string };

type Props = {
  title: string;
  description: string;
  developerWallet?: string;
  developerReceivingAddress?: string;
  clientName: string;
  clientEmail: string;
  value: string;
  setValue: (v: string) => void;
  currency: string;
  setCurrency: (v: string) => void;
  deadline: string;
  setDeadline: (v: string) => void;
  milestones: Milestone[];
  setMilestones: (m: Milestone[]) => void;
  paymentConfirmed: boolean;
  setPaymentConfirmed: (b: boolean) => void;
  isDeveloperView?: boolean;
};

const PaymentStep: React.FC<Props> = ({ title, description, developerWallet, developerReceivingAddress, clientName, clientEmail, value, setValue, currency, setCurrency, deadline, setDeadline, milestones, setMilestones, paymentConfirmed, setPaymentConfirmed, isDeveloperView }) => {
  const updateMilestone = (idx: number, field: 'title'|'amount', v: string) => {
    const next = milestones.map((m,i)=> i===idx ? {...m, [field]: v} : m);
    setMilestones(next);
  };

  const addMilestone = () => setMilestones([...milestones, {title:'New Milestone', amount: '0'}]);

  const confirmButtonText = isDeveloperView ? 'I accept these payment terms and milestones' : 'I confirm the developer and accept these payment terms';

  return (
    <>
      <h4 className={styles.sectionTitle}>Payment Terms</h4>
      <h4 className={styles.step}>Step 4 of 5</h4>

      <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'jura', fontWeight: 500}}>Project Details</div>
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

      <div className={styles.juraTitle} style={{paddingTop: '20px', fontFamily: 'jura', fontWeight: 500}}>Parties</div>
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

      <div style={{marginTop:12}}>
        <div className={styles.downloadPill} role="button" tabIndex={0} onClick={(e)=>e.preventDefault()} onKeyDown={(e)=>{ if(e.key==='Enter') e.preventDefault(); }}>
          <img src={downloadIcon} alt="download" className={styles.downloadIcon} />
          <a className={styles.downloadLink} href="#" onClick={(e)=>e.preventDefault()}>Download project files</a>
        </div>
      </div>

     

      <div className={styles.cardArea2}>
        <div style={{display:'flex', gap:16}}>
          <div style={{flex:1}} className={styles.formRow}>
            <label>Total Contract Value :</label>
            <input value={value} onChange={(e)=>setValue(e.target.value)} />
          </div>
          <div style={{width:180}} className={styles.formRow}>
            <label>Currency</label>
            <input value={currency} onChange={(e)=>setCurrency(e.target.value)} />
          </div>
        </div>

        <div className={styles.formRow}>
          <label>Project Deadline :</label>
          <input value={deadline} onChange={(e)=>setDeadline(e.target.value)} placeholder="Select Deadline" />
        </div>

        <h5 style={{fontWeight:700, marginTop:8}}>Milestone Breakdown</h5>
        <div style={{borderTop:'1px solid #e0e0e0', marginTop:8, paddingTop:8}}>
          {milestones.map((m, idx)=> (
            <div key={idx} className={styles.milestoneRow}>
              <input className={styles.milestoneInput} value={m.title} onChange={(e)=>updateMilestone(idx,'title', e.target.value)} />
              <input className={styles.amountInput} value={m.amount} onChange={(e)=>updateMilestone(idx,'amount', e.target.value)} />
            </div>
          ))}
          <div className={styles.milestoneTotalRow}>
            <div className={styles.totalLabel}>Total</div>
            <div className={styles.totalValue}>{milestones.reduce((s, m)=> s + Number(m.amount||0), 0)} {currency}</div>
          </div>
          <div style={{marginTop:12}}>
            <button onClick={addMilestone} className={styles.addMilestoneBtn}>Add milestone</button>
          </div>
        </div>

        <div style={{marginTop:16, display:'flex', gap:8, alignItems:'center'}}>
          <input id="confirmDev" type="checkbox" checked={paymentConfirmed} onChange={(e)=> setPaymentConfirmed(e.target.checked)} />
          <label htmlFor="confirmDev" style={{fontFamily:'Jura'}}>{confirmButtonText}</label>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
