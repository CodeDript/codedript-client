import React from 'react';
import styles from './contractsViewBase.module.css';

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
  const total = milestones.reduce((s, m) => s + Number(m.amount || 0), 0);
  const progress = milestones.length ? Math.round((1 / milestones.length) * 100) : 0;

  return (
    <div className={styles.summaryWrap}>
      <div className={styles.projectCard}>
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

      <div className={styles.milestoneCard}>
        <div className={styles.milestoneHeader}>Milestone Breakdown</div>
        <div className={styles.milestoneList}>
          {milestones.map((m, i) => (
            <div key={i} className={styles.milestoneItem}>
              <div className={styles.milestoneLeft}>
                <div className={styles.milestoneTitle}>{m.title}</div>
                <div className={styles.milestoneDue}>{m.due}</div>
              </div>
              <div className={styles.milestoneRight}>
                <div className={styles.milestoneAmount}>{m.amount} {currency}</div>
                <div className={styles.milestoneStatus}>{m.status || 'Pending'}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.milestoneFooter}>
        
         
         
        </div>
        
      </div>
       <button className={styles.readContractBtn}>Read Contract →</button>
    </div>
  );
};

export default ContractSummary;
