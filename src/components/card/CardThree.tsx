import React from 'react';
import styles from './CardThree.module.css';

interface CardThreeProps {
  title?: string;
  description?: string;
  icon?: string;
}

const CardThree: React.FC<CardThreeProps> = ({ 
  title = "Smart Contracts", 
  description = "Automate your processes with transparent and efficient smart contracts",
  icon = "⚡"
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default CardThree;
