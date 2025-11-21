import React from 'react';
import styles from './CardOne.module.css';

// Mock data for cards
export const cardData = [
  {
    id: 1,
    name: 'Blockchain Security',
    description: 'Smart contracts ensure payments are secure and transparent with immutable transaction records.',
    icon: '🛡️',
    route: '/features/blockchain-security'
  },
  {
    id: 2,
    name: 'IPFS File Storage',
    description: 'Decentralized file storage keeps your documents secure and accessible from anywhere.',
    icon: '📁',
    route: '/features/ipfs-storage'
  },
  {
    id: 3,
    name: 'Escrow Protection',
    description: 'Automated escrow system protects both parties until milestones are completed.',
    icon: '🔐',
    route: '/features/escrow-protection'
  },
  {
    id: 4,
    name: 'Multi-party Contracts',
    description: 'Support for complex agreements with multiple stakeholders and approval workflows.',
    icon: '👥',
    route: '/features/multi-party-contracts'
  },
  {
    id: 5,
    name: 'Zero Knowledge Verification',
    description: 'Verify identities and deliverables without exposing sensitive information.',
    icon: '🔍',
    route: '/features/zero-knowledge'
  },
  {
    id: 6,
    name: 'Instant Payments',
    description: 'Release payments instantly when work is approved, with transparent fee structure.',
    icon: '⚡',
    route: '/features/instant-payments'
  }
];

interface CardOneProps {
  title?: string;
  description?: string;
  icon?: string;
  cardId?: number;
}

const CardOne: React.FC<CardOneProps> = ({ 
  title, 
  description,
  icon,
  cardId = 1
}) => {
  // Use card data if cardId is provided and no custom props
  const card = cardData.find(c => c.id === cardId);
  const displayTitle = title || card?.name || "Secure Transactions";
  const displayDescription = description || card?.description || "Experience blockchain-powered security with every transaction";
  const displayIcon = icon || card?.icon || "🔒";

  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{displayIcon}</span>
      </div>
      <h3 className={styles.title}>{displayTitle}</h3>
      <p className={styles.description}>{displayDescription}</p>
    </div>
  );
};

export default CardOne;
