import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './contractprocessing.module.css';
import Button3Black1 from '../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../components/button/Button2/Button2';
import CardVector from '../../assets/svg/cardvector.svg';
import Lottie from 'lottie-react';
import blockchainAnimation from './blockchain.json';

const ContractProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Default values in case page is opened directly
  const { title = 'Package', price = '', delivery = '', revisions = 0, description = [], image = '' } = (state || {}) as any;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* decorative vector placed into the card background */}
        <img src={CardVector} alt="decorative vector" className={styles.vector} />
        <div className={styles.media}>
          {blockchainAnimation ? (
            <Lottie
              animationData={blockchainAnimation}
              loop
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : image ? (
            <img src={image} alt={title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.price}>{price}</div>

          <div className={styles.meta}>
            <div>Delivery: <strong>{delivery || '—'}</strong></div>
            <div>Revisions: <strong>{revisions}</strong></div>
          </div>

          <ul className={styles.features}>
            {Array.isArray(description) && description.length > 0 ? (
              description.map((d: string, idx: number) => (
                <li key={idx}>✓ {d}</li>
              ))
            ) : (
              <li>No features provided.</li>
            )}
          </ul>

          <div className={styles.actions}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button2 text="Back" onClick={() => navigate(-1)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button3Black1
                text="Start Contract"
                onClick={() => navigate('/create-contract', { state: { title, price, delivery, revisions, description, image } })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractProcessing;
