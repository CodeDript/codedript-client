import React from 'react';
import styles from './CardOne.module.css';

interface CardOneProps {
  title?: string;
  description?: string;
  icon?: string;
}

const CardOne: React.FC<CardOneProps> = ({ 
  title = "Secure Transactions", 
  description = "Experience blockchain-powered security with every transaction",
  icon = "🔒"
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

export default CardOne;
