import React, { useRef, useState, useEffect } from 'react';
import styles from './GigDetails.module.css';
import downBlackLine from '../../assets/svg/downBlackLine.svg';
interface GigDetailsProps {
  images?: string[];
}

const GigDetails: React.FC<GigDetailsProps> = ({ images = [] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth / 1.1;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const placeholders = Array.from({ length: Math.max(6, images.length) });

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
            {images && images.length > 0 ? (
              images.map((src, i) => (
                <div className={styles.imagePlaceholder} key={i}>
                  <img
                    src={src}
                    alt={`gig-${i}`}
                    className={styles.imageThumb}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '' }}
                    onClick={() => setLightboxSrc(src)}
                    role="button"
                    aria-label={`Open image ${i+1}`}
                  />
                </div>
              ))
            ) : (
              placeholders.map((_, i) => (
                <div className={styles.imagePlaceholder} key={i}>
                  <span className={styles.imageIcon}>
                    <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#E0E0E0"/><path d="M8 13l2.5 3.5L15 11l4 6H5l3-4z" fill="#BDBDBD"/><circle cx="9" cy="9" r="2" fill="#BDBDBD"/></svg>
                  </span>
                </div>
              ))
            )}
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
      {lightboxSrc && (
        <div className={styles.lightboxBackdrop} onClick={() => setLightboxSrc(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightboxSrc(null)} aria-label="Close image">×</button>
            <img src={lightboxSrc} alt="Enlarged gig" className={styles.lightboxImage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GigDetails;
