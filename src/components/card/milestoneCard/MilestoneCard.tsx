import React from 'react';
import styles from './MilestoneCard.module.css';

type Milestone = { title: string; due?: string; amount?: string; status?: string };

type Props = {
  milestone: Milestone;
  index?: number;
  editable?: boolean; // show action buttons
  onUpdateStatus?: (index: number | undefined, newStatus: string) => void;
};

const MilestoneCard: React.FC<Props> = ({ milestone, index, editable = false, onUpdateStatus }) => {
  const { title, due, amount, status } = milestone;

  const statusClass = status === 'done' ? styles.statusDone : status === 'inprogress' ? styles.statusInprogress : styles.statusPending;

  const handleMarkInProgress = () => onUpdateStatus && onUpdateStatus(index, 'inprogress');
  const handleMarkDone = () => onUpdateStatus && onUpdateStatus(index, 'done');
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => onUpdateStatus && onUpdateStatus(index, e.target.value);

  return (
    <div className={styles.milestoneCard} role="group" aria-label={`Milestone ${title}`}>
      <div className={styles.left}>
        <div className={styles.iconWrap} aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#e2e2e2" strokeWidth="1.2" />
            <path d="M8 12l2.5 2.5L16 9" stroke="#bdbdbd" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className={styles.titleWrap}>
          <div className={styles.title}>{title}</div>
          {due && <div className={styles.due}>Due: {due}</div>}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.amount}>{amount} </div>
        <div className={`${styles.statusBadge} ${statusClass}`} aria-live="polite">{status || 'Pending'}</div>

        <select
          className={styles.statusSelect}
          aria-label={`Change status for ${title}`}
          value={status || 'pending'}
          onChange={handleSelectChange}
        >
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        {editable && (
          <div className={styles.btns}>
            <button className={`${styles.actionBtn} ${styles.inprogressBtn}`} onClick={handleMarkInProgress} aria-label={`Mark ${title} in progress`}>
              In Progress
            </button>
            <button className={`${styles.actionBtn} ${styles.doneBtn}`} onClick={handleMarkDone} aria-label={`Mark ${title} done`}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneCard;
