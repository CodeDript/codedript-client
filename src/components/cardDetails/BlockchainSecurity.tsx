import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const BlockchainSecurity: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Blockchain Security</h1>
        <p>
          Smart contracts ensure payments are secure and transparent with immutable transaction records.
          We use audited contracts and secure signature flows to protect both clients and developers.
        </p>
        <section className={styles.detailSection}>
          <h2>How it helps you</h2>
          <ul>
            <li>Immutable ledger of payments & approvals</li>
            <li>Automated dispute resolution workflows</li>
            <li>Enhanced transparency with audit trails</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlockchainSecurity;
