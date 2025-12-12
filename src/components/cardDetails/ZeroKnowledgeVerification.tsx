import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const ZeroKnowledgeVerification: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Zero Knowledge Verification</h1>
        <p>
          Verify identities and deliverables without exposing sensitive information.
          Use cryptographic proofs to confirm milestones without revealing unnecessary details.
        </p>
        <section className={styles.detailSection}>
          <h2>Advantages</h2>
          <ul>
            <li>Protect privacy</li>
            <li>Reduce leakage of proprietary data</li>
            <li>Compliance-friendly verification</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ZeroKnowledgeVerification;
