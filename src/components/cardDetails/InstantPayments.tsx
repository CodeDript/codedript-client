import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const InstantPayments: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Instant Payments</h1>
        <p>
          Release payments instantly when work is approved, with transparent fee structure.
          Built-in payout rails and flexible settlement options reduce wait time for creators.
        </p>
        <section className={styles.detailSection}>
          <h2>Features</h2>
          <ul>
            <li>Fast payout rails</li>
            <li>Flexible currencies</li>
            <li>Built-in fee transparency</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InstantPayments;
