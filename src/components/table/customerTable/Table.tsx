import React, { useEffect, useState } from 'react';
import styles from './Table.module.css';
import { ReviewService, type Review } from '../../../api/reviewService';

interface TableProps {
  developerId?: string;
}

const renderStars = (count: number) => (
  <span className={styles.stars}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
    ))}
  </span>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const Table: React.FC<TableProps> = ({ developerId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!developerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ReviewService.getDeveloperReviews(developerId, 1, 20);
        setReviews(response.reviews);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [developerId]);

  if (loading) {
    return (
      <div className={styles.tableWrapper1}>
        <div className={styles.tableWrapper}>
          <div className={styles.headerRow}>
            <span className={styles.headerTitle}>Customer reviews</span>
          </div>
          <div className={styles.body}>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
              Loading reviews...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.tableWrapper1}>
        <div className={styles.tableWrapper}>
          <div className={styles.headerRow}>
            <span className={styles.headerTitle}>Customer reviews</span>
          </div>
          <div className={styles.body}>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={styles.tableWrapper1}>
        <div className={styles.tableWrapper}>
          <div className={styles.headerRow}>
            <span className={styles.headerTitle}>Customer reviews</span>
          </div>
          <div className={styles.body}>
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
              No reviews yet
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper1}>
    <div className={styles.tableWrapper}>
      <div className={styles.headerRow}>
        <span className={styles.headerTitle}>Customer reviews</span>
      </div>
      <div className={styles.body}>
        {reviews.map((r) => (
          <div className={styles.row} key={r._id}>
            <div className={styles.orderCell}>
              <span className={styles.orderNumber}>{r.gig?.gigId ? String(r.gig.gigId).padStart(4, '0') : '0000'}</span>
            </div>
            <div className={styles.titleCell}>
              <div className={styles.titleMain}>{r.agreement?.project?.title || r.gig?.title || 'Project'}</div>
              <div className={styles.reviewer}>
                <span className={styles.userIcon}>👤</span> {r.reviewer?.profile?.name || 'Anonymous'}
              </div>
            </div>
            <div className={styles.ratingCell}>{renderStars(r.rating)}</div>
            <div className={styles.dateCell}>Created {formatDate(r.createdAt)}</div>
            <div className={styles.reviewCell}>{r.review}</div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Table;
