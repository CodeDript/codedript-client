import React from 'react';
import styles from './cardDetails.module.css';
import Footer from '../footer/Footer';

const IPFSFileStorage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.content}>
        <h1>IPFS File Storage</h1>
        <p>
          Decentralized file storage keeps your documents secure and accessible from anywhere.
          Files are hashed and stored with content-addressable links for integrity and availability.
        </p>
        <section className={styles.detailSection}>
          <h2>Key features</h2>
          <ul>
            <li>Content-addressable storage</li>
            <li>Permissioned access via encryption</li>
            <li>Redundancy and fault tolerance</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default IPFSFileStorage;
