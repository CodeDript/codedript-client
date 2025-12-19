import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const EscrowProtection: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Escrow Protection</h1>
        <p>
          Automated escrow system protects both parties until milestones are completed.
          Funds are held securely and released only when agreed-upon milestones are fulfilled.
        </p>
        <section className={styles.detailSection}>
          <h2>Benefits</h2>
          <ul>
            <li>Reduce payment disputes</li>
            <li>Transparent milestone releases</li>
            <li>Integrated audit trail</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default EscrowProtection;
