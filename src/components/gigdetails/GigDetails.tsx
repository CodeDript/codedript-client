import React, { useRef } from 'react';
import styles from './GigDetails.module.css';
import downBlackLine from '../../assets/svg/downBlackLine.svg';

type Props = {
  images?: Array<{ url: string; publicId?: string }>;
};

const GigDetails: React.FC<Props> = ({ images = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 1.1;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Use actual images if available, otherwise show placeholders
  const displayItems = images.length > 0 ? images : Array.from({ length: 6 }).map((_, i) => ({ url: '', publicId: `placeholder-${i}` }));

  return (
    <div className={styles.card}>
 
      <div className={styles.subheading}>Gig reference :</div>
      <div className={styles.imageScrollWrapper}>
        <button className={styles.scrollBtn} onClick={() => handleScroll('left')} aria-label="Scroll left">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="none"/>
            <path d="M15.5 19L8.5 12L15.5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className={styles.imageRow} ref={scrollRef}>
          {displayItems.map((item, i) => (
            <div className={styles.imagePlaceholder} key={item.publicId || i}>
              {item.url ? (
                <img 
                  src={item.url} 
                  alt={`Gig reference ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    console.error('Failed to load gig image:', item.url);
                    // Show placeholder icon on error
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <span className={styles.imageIcon} style={{ display: item.url ? 'none' : 'flex' }}>
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#E0E0E0"/><path d="M8 13l2.5 3.5L15 11l4 6H5l3-4z" fill="#BDBDBD"/><circle cx="9" cy="9" r="2" fill="#BDBDBD"/></svg>
              </span>
            </div>
          ))}
        </div>
        <button className={styles.scrollBtn} onClick={() => handleScroll('right')} aria-label="Scroll right">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="none"/>
            <path d="M8.5 5L15.5 12L8.5 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="githubLink">Project Link (Github):</label>
        <input className={styles.input} id="githubLink" type="text" placeholder="Enter Github link" />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="hostLink">Project Link 2 (Host):</label>
        <input className={styles.input} id="hostLink" type="text" placeholder="Enter host link" />
      </div>
      <img src={downBlackLine} alt="decorative line" className={styles.cornerSvg} />
    </div>
  );
};

export default GigDetails;
