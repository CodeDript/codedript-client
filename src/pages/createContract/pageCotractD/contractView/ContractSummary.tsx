import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './contractsViewBase.module.css';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../../../components/button/Button2/Button2';
import MilestoneCard from '../../../../components/card/milestoneCard/MilestoneCard';

type Milestone = { title: string; due?: string; amount?: string; status?: string };

type Props = {
  title: string;
  description: string;
  value: string;
  currency: string;
  deadline: string;
  clientName: string;
  developerName: string;
  milestones: Milestone[];
};

const ContractSummary: React.FC<Props> = ({ title, description, value, currency, deadline, clientName, developerName, milestones }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const agreement = location.state?.agreement;
  const [localMilestones, setLocalMilestones] = useState(milestones && milestones.length ? milestones : []);

  useEffect(() => {
    setLocalMilestones(milestones && milestones.length ? milestones : []);
  }, [milestones]);

  const total = localMilestones.reduce((s: number, m: any) => s + Number(m.amount || 0), 0);
  const progress = localMilestones.length ? Math.round((localMilestones.filter((m: any) => m.status === 'done').length / localMilestones.length) * 100) : 0;

  const handleUpdateMilestoneStatus = (index: number | undefined, newStatus: string) => {
    if (typeof index !== 'number') return;
    setLocalMilestones(prev => prev.map((m, i) => i === index ? { ...m, status: newStatus } : m));
  };

  return (
    <div className={styles.summaryWrap1}>
      <div className={styles.leftColumn}>
        <div className={styles.projectCard1}>
          <div className={styles.projectCardInner}>
            <div className={styles.overviewHeader}>Project Overview</div>
            <div className={styles.overviewBox}>
              <div className={styles.overviewRow}>
                <div className={styles.overviewLabel}>Title :</div>
                <div className={styles.overviewValue}>{title}</div>
              </div>
              <div className={styles.overviewRow}>
                <div className={styles.overviewLabel}>Description :</div>
                <div className={styles.overviewValue}>{description}</div>
              </div>
              <div className={styles.overviewMeta}>
                <div><strong>Value :</strong> {value} {currency}</div>
                <div><strong>Deadline :</strong> {deadline}</div>
                <div><strong>Milestone :</strong> {milestones.length} / {milestones.length}</div>
                <div><strong>Progress :</strong> {progress}%</div>
              </div>

              <div className={styles.progressBar} aria-hidden>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.partiesCard}>
          <div className={styles.overviewHeader}>Parties</div>
          <div className={styles.partiesInner}>
            <div className={styles.partiesCol}>
              <div className={styles.partiesHeading}>Client</div>
              <div className={styles.partiesName}>{clientName}</div>
              <div className={styles.partiesSub}>example@email.com</div>
            </div>
            <div className={styles.partiesCol}>
              <div className={styles.partiesHeading}>Developer</div>
              <div className={styles.partiesName}>{developerName}</div>
              <div className={styles.partiesSub}>developer@email.com</div>
            </div>
            
          </div>
        </div>

      

        <div className={styles.milestoneFooter}>
          <div className={styles.totalLabel}>Total</div>
          <div className={styles.totalValue}>{total} {currency}</div>
        </div>

       
 <div className={styles.buttonWrapper}>
          <Button3Black1 
            text="Read Contract" 
            onClick={() => navigate('/create-contract/terms', { state: { agreement } })}
          />
        </div>

        <div className={styles.milestoneCard}>
        <div className={styles.milestoneHeader}>Milestone Breakdown</div>
          <div className={styles.milestoneList}>
            {localMilestones.map((m: any, i: number) => (
              <MilestoneCard
                key={i}
                index={i}
                milestone={m}
                editable={true}
                onUpdateStatus={handleUpdateMilestoneStatus}
              />
            ))}
          </div>
        </div>
      
        
        <div className={styles.actionsRow}>
          <div className={styles.prevBtn}>
            <Button2 text="← Previous" onClick={() => { window.history.back(); }} />
          </div>
          <div className={styles.actionsRight}>
            <Button2 text="View payment" onClick={() => { /* navigate to payment */ }} />
            <Button3Black1 
              text="Request Change" 
              onClick={() => navigate('/create-contract/request-change', { state: { agreement } })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;
