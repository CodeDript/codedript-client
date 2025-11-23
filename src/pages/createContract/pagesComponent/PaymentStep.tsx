import React from 'react';
import styles from '../pageCotractD/pageCotractD.module.css';

type Milestone = { title: string; amount: string };

type Props = {
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
};

const PaymentStep: React.FC<Props> = ({ value, setValue, currency, setCurrency, deadline, setDeadline, milestones, setMilestones, paymentConfirmed, setPaymentConfirmed }) => {
  const updateMilestone = (idx: number, field: 'title'|'amount', v: string) => {
    const next = milestones.map((m,i)=> i===idx ? {...m, [field]: v} : m);
    setMilestones(next);
  };

  const addMilestone = () => setMilestones([...milestones, {title:'New Milestone', amount: '0'}]);

  return (
    <>
      <h4 className={styles.sectionTitle}>Payment Terms</h4>
      <h4 className={styles.step}>Step 4 of 5</h4>

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
            <div key={idx} style={{display:'flex', justifyContent:'space-between', gap:12, marginBottom:8}}>
              <input style={{flex:1}} value={m.title} onChange={(e)=>updateMilestone(idx,'title', e.target.value)} />
              <input style={{width:160}} value={m.amount} onChange={(e)=>updateMilestone(idx,'amount', e.target.value)} />
            </div>
          ))}
          <div style={{display:'flex', justifyContent:'space-between', marginTop:12}}>
            <div style={{fontWeight:700}}>Total</div>
            <div style={{fontWeight:700}}>{milestones.reduce((s, m)=> s + Number(m.amount||0), 0)} {currency}</div>
          </div>
          <div style={{marginTop:12}}>
            <button onClick={addMilestone} style={{padding:'8px 12px', borderRadius:8}}>Add milestone</button>
          </div>
        </div>

        <div style={{marginTop:16, display:'flex', gap:8, alignItems:'center'}}>
          <input id="confirmDev" type="checkbox" checked={paymentConfirmed} onChange={(e)=> setPaymentConfirmed(e.target.checked)} />
          <label htmlFor="confirmDev" style={{fontFamily:'Jura'}}>I confirm the developer and accept these payment terms</label>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
