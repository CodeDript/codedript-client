import React from 'react';
import styles from './CardTwo.module.css';

interface CardTwoProps {
  title?: string;
  description?: string;
  icon?: string;
}

const CardTwo: React.FC<CardTwoProps> = ({ 
  title = "Decentralized Network", 
  description = "Join a global network of users powered by blockchain technology",
  icon = "🌐"
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

export default CardTwo;
