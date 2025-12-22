import React, { useEffect, useState } from 'react';
import styles from './TransactionModal.module.css';
import { getTransactionDetails } from '../../../services/ContractService';

interface TransactionModalProps {
  transactionHash: string;
  blockchainId?: number;
  onClose: () => void;
}

type TransactionDetails = {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  blockNumber: string;
  timestamp: string;
  status: string;
  input?: string;
  decodedInput?: {
    functionName: string;
    functionSelector?: string;
    developer?: string;
    ipfsHash?: string;
    inputDataLength?: number;
    hasIPFSHash?: boolean;
  };
}

const TransactionModal: React.FC<TransactionModalProps> = ({ transactionHash, blockchainId, onClose }) => {
  const [, setDetails] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [displayText, setDisplayText] = useState<string[]>([]);
  const [ipfsHashFromContract, setIpfsHashFromContract] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      setDisplayText(['> Fetching transaction details...', '> Please wait...']);

      try {
        // Fetch IPFS hash from smart contract if blockchainId is available
        if (blockchainId !== undefined && blockchainId !== null) {
          try {
            const { getAgreementSummary } = await import('../../../services/ContractService');
            const agreementData = await getAgreementSummary(blockchainId);
            if (agreementData.docCid) {
              setIpfsHashFromContract(agreementData.docCid);
            }
          } catch (err) {
            // Silently handle IPFS fetch errors
          }
        }

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
        ];

        // Add decoded input data if available
        if (txDetails.decodedInput) {
          output.push('> --------------------------------');
          output.push('> Contract Call Information:');
          output.push('> --------------------------------');
          output.push(`> Function:    ${txDetails.decodedInput.functionName}`);
          
          if (txDetails.decodedInput.functionSelector) {
            output.push(`> Selector:    ${txDetails.decodedInput.functionSelector}`);
          }
          
          if (txDetails.decodedInput.developer) {
            output.push(`> Developer:   ${txDetails.decodedInput.developer}`);
          }
          
          // Show IPFS hash from contract first (most reliable), then from decoded input
          const ipfsToShow = ipfsHashFromContract || txDetails.decodedInput.ipfsHash;
          
          if (ipfsToShow) {
            output.push(`> IPFS Hash:   ${ipfsToShow}`);
            output.push('> IPFS Link:   https://copper-near-junglefowl-259.mypinata.cloud/ipfs/' + ipfsToShow);
          } else if (txDetails.decodedInput.hasIPFSHash) {
            output.push('> IPFS Hash:   ✓ Included in transaction');
          }
          
          if (txDetails.decodedInput.inputDataLength) {
            output.push(`> Data Size:   ${txDetails.decodedInput.inputDataLength} bytes`);
          }
          
          output.push('');
        }

        // Add input data preview
        if (txDetails.input && txDetails.input !== '0x') {
          output.push('> Input Data:');
          output.push(`> ${txDetails.input.slice(0, 66)}...`);
          output.push('');
        }
        
        output.push('> ================================');
        output.push('> End of transaction details');
        
        setDisplayText(output);
      } catch (err) {
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
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>Transaction Details</h2>
            <div className={styles.subtitle}>Blockchain Confirmation</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        
        <div className={styles.body}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Fetching transaction data...</p>
            </div>
          ) : (
            <div className={styles.content}>
              {displayText.map((line, index) => {
                const cleanLine = line.replace(/^>\s*/, '');
                
                // Skip Contract Call Information section and separators
                if (cleanLine.includes('Contract Call Information') || 
                    cleanLine.includes('===') || 
                    cleanLine.includes('---') || 
                    cleanLine === 'End of transaction details' || 
                    cleanLine === 'Transaction Details Retrieved' ||
                    !cleanLine) {
                  return null;
                }
                
                // Parse key-value pairs
                if (cleanLine.includes(':')) {
                  const [key, ...valueParts] = cleanLine.split(':');
                  const value = valueParts.join(':').trim();
                  const keyClean = key.trim();
                  
                  // Skip Selector and Input Data sections
                  if (keyClean === 'Selector' || keyClean === 'Input Data') {
                    return null;
                  }
                  
                  // Special rendering for links
                  if (keyClean === 'IPFS Link') {
                    return (
                      <div key={index} className={styles.dataRow}>
                        <div className={styles.dataLabel}>{keyClean}</div>
                        <a href={value} target="_blank" rel="noopener noreferrer" className={styles.dataLink}>
                          View on IPFS →
                        </a>
                      </div>
                    );
                  }
                  
                  // Special styling for hash values
                  const isHash = keyClean.includes('Hash') || keyClean.includes('From') || keyClean.includes('To') || keyClean.includes('Developer');
                  
                  return (
                    <div key={index} className={styles.dataRow}>
                      <div className={styles.dataLabel}>{keyClean}</div>
                      <div className={isHash ? styles.dataValueHash : styles.dataValue}>
                        {value}
                      </div>
                    </div>
                  );
                }
                
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
