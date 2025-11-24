import React, { useEffect, useState } from 'react';
import styles from './TransactionModal.module.css';
import { getTransactionDetails } from '../../../services/ContractService';

interface TransactionModalProps {
  transactionHash: string;
  onClose: () => void;
}

interface TransactionDetails {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: string;
  timestamp: string;
  status: string;
  data?: string;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transactionHash, onClose }) => {
  const [details, setDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string[]>([]);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      setDisplayText(['> Fetching transaction details...', '> Please wait...']);

      try {
        const txDetails = await getTransactionDetails(transactionHash);
        setDetails(txDetails);
        
        // Create terminal-style output
        const output = [
          '> Transaction Details Retrieved',
          '> ================================',
          '',
          `> Transaction Hash: ${txDetails.hash}`,
          '',
          `> From:        ${txDetails.from}`,
          `> To:          ${txDetails.to}`,
          `> Value:       ${txDetails.value} ETH`,
          '',
          `> Block:       #${txDetails.blockNumber}`,
          `> Timestamp:   ${txDetails.timestamp}`,
          `> Status:      ${txDetails.status}`,
          '',
          `> Gas Used:    ${txDetails.gasUsed}`,
          `> Gas Price:   ${txDetails.gasPrice} Gwei`,
          '',
          '> ================================',
          '> End of transaction details',
        ];
        
        setDisplayText(output);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
        setDisplayText([
          '> ERROR: Failed to fetch transaction details',
          `> ${err instanceof Error ? err.message : 'Unknown error'}`,
          '',
          '> Please try again later',
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionHash]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <div className={styles.buttons}>
            <span className={styles.closeBtn} onClick={onClose}></span>
            <span className={styles.minimizeBtn}></span>
            <span className={styles.maximizeBtn}></span>
          </div>
          <div className={styles.title}>Transaction Inspector v1.0</div>
        </div>
        
        <div className={styles.body}>
          <div className={styles.prompt}>root@blockchain:~$</div>
          {displayText.map((line, index) => (
            <div key={index} className={styles.line}>
              {line}
            </div>
          ))}
          {loading && (
            <div className={styles.cursor}>_</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
