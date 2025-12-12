import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';
import { getAgreementsByUserId, type MockAgreement as Agreement } from '../../../mockData/agreementData';
import TransactionModal from '../../modal/TransactionModal/TransactionModal';

export type TabKey = 'activeContract' | 'transactions' | 'ongoingContract';

interface UserTableProps {
  userId?: string;
}

interface DevRow {
  id: string;
  order: string;
  title: string;
  client: string;
  date: string;
  status: string;
  amount: string;
  transactionHash?: string;
}

const TabLabel: Record<TabKey, string> = {
  activeContract: 'Active Contract',
  transactions: 'Transactions',
  ongoingContract: 'Ongoing Contract',
};

// Map tab keys to agreement statuses (for client role)
const getStatusesForTab = (tab: TabKey): string[] => {
  switch (tab) {
    case 'activeContract':
      return ['active', 'in_progress', 'escrow_deposit'];
    case 'transactions':
      return []; // Transactions are fetched separately
    case 'ongoingContract':
      return ['pending_developer', 'pending_client', 'awaiting_final_approval']; // Pending developer setup OR pending client review
    default:
      return [];
  }
};

// Map agreement status to display status
const getDisplayStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'pending_developer': 'Incoming',
    'pending_client': 'Pending',
    'pending_signatures': 'Pending',
    'escrow_deposit': 'Depositing',
    'active': 'Active',
    'in_progress': 'Active',
    'awaiting_final_approval': 'Ongoing',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'disputed': 'Disputed'
  };
  return statusMap[status] || status;
};

// Convert Agreement to DevRow for display
const agreementToRow = (agreement: Agreement): DevRow => {
  const date = new Date(agreement.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  return {
    id: agreement._id,
    order: String(agreement.agreementId || (typeof agreement._id === 'string' ? agreement._id.slice(-4).toUpperCase() : String(agreement._id).slice(-4).toUpperCase())),
    title: agreement.project?.name || 'Untitled Agreement',
    client: agreement.developer?.profile?.name || agreement.developer?.email || 'Unknown Developer',
    date,
    status: getDisplayStatus(agreement.status),
    amount: `${agreement.financials.totalValue} ${agreement.financials.currency}`
  };
};

// (Using agreements with blockchain.transactionHash for Transactions tab)

const UserTable: React.FC<UserTableProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('activeContract');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(null);
  const [selectedBlockchainId, setSelectedBlockchainId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // use a request id to avoid stale responses overwriting newer state
  const requestRef = React.useRef(0);

  const handleAgreementClick = (rowId: string) => {
    // Handle transactions tab separately - open modal
    if (activeTab === 'transactions') {
      const agreement = agreements.find(a => a._id === rowId);
      if (agreement && (agreement as any).blockchain?.transactionHash) {
        setSelectedTxHash((agreement as any).blockchain.transactionHash);
        setSelectedBlockchainId((agreement as any).blockchain?.agreementId);
      }
      return;
    }
    
    // Only allow clicking for ongoing contracts tab
    if (activeTab !== 'ongoingContract') return;
    
    const agreement = agreements.find(a => a._id === rowId);
    if (!agreement) return;
    
    // Only navigate if status is pending_client (ready for client review after developer set payment terms)
    if (agreement.status === 'pending_client') {
      // Navigate to contract review page
      navigate('/create-contract', {
        state: {
          agreementId: agreement._id,
          agreement: agreement,
          isClientView: true
        }
      });
    }
    // pending_developer agreements are visible but not clickable (waiting for developer)
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const reqId = ++requestRef.current;
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Handle transactions tab separately: fetch agreements that have blockchain transaction hashes
        if (activeTab === 'transactions') {
          if (requestRef.current !== reqId) return;

          const allAgreements = getAgreementsByUserId(userId || 'client-001');
          // keep only agreements that have a blockchain transaction hash
          const txAgreements = allAgreements.filter(a => (a as any).blockchainTxHash);
          const displayRows = txAgreements.map(a => ({
            ...agreementToRow(a),
            transactionHash: (a as any).blockchainTxHash
          }));

          setAgreements(txAgreements as Agreement[]);
          setRows(displayRows);
        } else {
          // Get the statuses for the current tab
          const statuses = getStatusesForTab(activeTab);
          
          // Fetch agreements with mock data
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // only set state if this request is the latest
          if (requestRef.current !== reqId) return;

          // Get agreements from mock data
          const allAgreements = getAgreementsByUserId(userId || 'client-001', statuses);
          
          // Convert to display rows
          const displayRows = allAgreements.map(agreementToRow);
          
          setAgreements(allAgreements);
          setRows(displayRows);
        }
      } catch (err) {
        if (requestRef.current !== reqId) return;
        console.error('Error fetching data:', err);
        setError(activeTab === 'transactions' ? 'Failed to load transactions' : 'Failed to load contracts');
        setRows([]);
      } finally {
        if (requestRef.current === reqId) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // no-op cleanup: future requests will have a different reqId
    return () => { /* keep requestRef.current as latest */ };
  }, [activeTab, userId]);

  return (
    <div className={styles.tableWrapper1}>
      <div className={styles.tableWrapper}>
        <div className={styles.tabsBar}>
          {Object.keys(TabLabel).map(k => {
            const key = k as TabKey;
            return (
              <button 
                key={key} 
                className={`${styles.tabButton} ${activeTab === key ? styles.tabActive : ''}`} 
                onClick={() => setActiveTab(key)}
              >
                {TabLabel[key]}
              </button>
            );
          })}
        </div>

        <div className={styles.body}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && rows.length === 0 && (
            <div className={styles.empty}>No contracts found</div>
          )}

          {!loading && !error && rows.map(r => {
            const agreement = agreements.find(a => a._id === r.id);
            const isClickable = activeTab === 'transactions' || (activeTab === 'ongoingContract' && agreement?.status === 'pending_client');
            
            return (
              <div 
                className={styles.row} 
                key={r.id}
                onClick={() => handleAgreementClick(r.id)}
                style={{
                  cursor: isClickable ? 'pointer' : 'default'
                }}
              >
                {activeTab === 'transactions' ? (
                  // Transactions tab: keep same cell structure as Active Contract
                  // but show truncated Tx hash in the title and hide status visually
                  <>
                    <div className={styles.orderCell}>
                      <span className={styles.orderNumber}>Tx</span>
                    </div>
                    <div className={styles.titleCell}>
                      <div className={styles.titleMain}>
                        {r.transactionHash ? `${r.transactionHash.slice(0, 6)}...${r.transactionHash.slice(-4)}` : 'N/A'}
                      </div>
                      <div className={styles.reviewer}></div>
                    </div>
                    <div className={styles.dateCell}>Created {r.date}</div>
                    <div className={styles.statusCell}>
                      <span className={styles.pill} style={{ visibility: 'hidden' }}>hidden</span>
                    </div>
                    <div className={styles.amountCell}>{r.amount}</div>
                  </>
                ) : (
                  // Other tabs: show full details
                  <>
                    <div className={styles.orderCell}>
                      <span className={styles.orderNumber}>{r.order}</span>
                    </div>
                    <div className={styles.titleCell}>
                      <div className={styles.titleMain}>{r.title}</div>
                      <div className={styles.reviewer}>with {r.client}</div>
                    </div>
                    <div className={styles.dateCell}>Created {r.date}</div>
                    <div className={styles.statusCell}>
                      <span className={`${styles.pill} ${styles['pill-' + (r.status || '').toLowerCase()]}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className={styles.amountCell}>{r.amount}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedTxHash && (
        <TransactionModal
          transactionHash={selectedTxHash}
          blockchainId={selectedBlockchainId}
          onClose={() => {
            setSelectedTxHash(null);
            setSelectedBlockchainId(undefined);
          }}
        />
      )}
    </div>
  );
};

export default UserTable;
