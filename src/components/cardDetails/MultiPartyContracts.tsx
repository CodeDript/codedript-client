import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const MultiPartyContracts: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>Multi-party Contracts</h1>
        <p>
          Support for complex agreements with multiple stakeholders and approval workflows.
          Our contract engine supports roles, approvals and branching milestones for teams.
        </p>
        <section className={styles.detailSection}>
          <h2>Use cases</h2>
          <ul>
            <li>Collaborative development projects</li>
            <li>Subcontractor approvals</li>
            <li>Enterprise workflow integrations</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MultiPartyContracts;
