
import React from 'react';
import styles from './Table.module.css';

const reviews = [
  {
    order: '0125',
    title: 'Mobile App UI Revamp',
    reviewer: 'Raju Fernando',
    date: 'Jan 01, 2024',
    rating: 5,
    review: 'Excellent audit delivered and the milestone-based release protected us. The only hiccup was that the reviewer asked for pass during...'
  },
  {
    order: '0126',
    title: 'Mobile App Development',
    reviewer: 'Denis Kim',
    date: 'Jan 15, 2024',
    rating: 4,
    review: 'Good results and secure payments, but the onboarding for non-crypto users was confusing for our social team. We would’ve liked clearer...'
  },
  {
    order: '0127',
    title: 'Website Redesign Project',
    reviewer: 'Maria Lopez',
    date: 'Jan 01, 2024',
    rating: 5,
    review: 'The freelancer delivered a working prototype within the agreed milestones — funds were released automatically.'
  },
  {
    order: '0129',
    title: 'UX / UI Design',
    reviewer: 'Ahmed Al-Suqedi',
    date: 'Jan 01, 2024',
    rating: 3,
    review: 'Conceptually strong but the talent pool for our niche was shallow. We ended up re-posting the job multiple times...'
  },
  {
    order: '0130',
    title: 'Backend API Integration',
    reviewer: 'Chloe Martin',
    date: 'Feb 02, 2024',
    rating: 5,
    review: 'Fast turnaround and clear milestone tracking. We paid in stablecoin which saved on FX fees. Would appreciate more ...'
  },
   {
    order: '0127',
    title: 'Website Redesign Project',
    reviewer: 'Maria Lopez',
    date: 'Jan 01, 2024',
    rating: 5,
    review: 'The freelancer delivered a working prototype within the agreed milestones — funds were released automatically.'
  },
  {
    order: '0129',
    title: 'UX / UI Design',
    reviewer: 'Ahmed Al-Suqedi',
    date: 'Jan 01, 2024',
    rating: 3,
    review: 'Conceptually strong but the talent pool for our niche was shallow. We ended up re-posting the job multiple times...'
  },
  {
    order: '0130',
    title: 'Backend API Integration',
    reviewer: 'Chloe Martin',
    date: 'Feb 02, 2024',
    rating: 5,
    review: 'Fast turnaround and clear milestone tracking. We paid in stablecoin which saved on FX fees. Would appreciate more ...'
  },
];

const renderStars = (count: number) => (
  <span className={styles.stars}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
    ))}
  </span>
);

const Table: React.FC = () => {
  return (
    <div className={styles.tableWrapper1}>
    <div className={styles.tableWrapper}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>Customer reviews</span>
      </div>
      <div className={styles.body}>
        {reviews.map((r, idx) => (
          <div className={styles.row} key={r.order}>
            <div className={styles.orderCell}>
              <span className={styles.orderNumber}>{r.order}</span>
            </div>
            <div className={styles.titleCell}>
              <div className={styles.titleMain}>{r.title}</div>
              <div className={styles.reviewer}><span className={styles.userIcon}>👤</span> {r.reviewer}</div>
            </div>
            <div className={styles.ratingCell}>{renderStars(r.rating)}</div>
            <div className={styles.dateCell}>Created {r.date}</div>
            <div className={styles.reviewCell}>{r.review}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Table;
