import React from 'react';
import styles from './developer.module.css';
import DeveloperHero from '../../../components/hero/DeveloperHero/DeveloperHero';

const Developer: React.FC = () => {
  return (
    <div className={styles.container}>
      <DeveloperHero />
    </div>
  );
};

export default Developer;
