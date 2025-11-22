import React from 'react';
import styles from './client.module.css';
import UserHero from '../../../components/hero/UserHero/UserHero';

const Client: React.FC = () => {
  return (
    <div className={styles.container}>
      <UserHero />
    </div>
  );
};

export default Client;
