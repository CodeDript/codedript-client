import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';
import { useUserAgreements } from '../../../query/useAgreements';
import type { Agreement } from '../../../types';
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
      return ['active', 'in-progress', 'completed', 'paid'];
    case 'transactions':
      return []; // Transactions are fetched separately
    case 'ongoingContract':
      return ['pending', 'priced', 'rejected', 'cancelled'];
    default:
      return [];
  }
};

// Map agreement status to display status
const getDisplayStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'priced': 'Priced',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'active': 'Active',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'paid': 'Paid'
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

  // Get developer name from populated field
  const partnerName = (agreement.developer && typeof agreement.developer === 'object') 
    ? (agreement.developer.fullname || agreement.developer.email || 'Unknown')
    : 'Unknown';

  return {
    id: agreement._id,
    order: agreement.agreementID || agreement._id.slice(-4).toUpperCase(),
    title: agreement.title || 'Untitled Agreement',
    client: partnerName,
    date,
    status: getDisplayStatus(agreement.status),
    amount: `${agreement.financials.totalValue} ETH`
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

  // Fetch agreements using React Query
  const { data: agreementsData, isLoading, error: apiError } = useUserAgreements();

  // Filter and transform agreements based on active tab
  const { filteredAgreements, displayRows } = useMemo(() => {
    if (!agreementsData?.data?.agreements || !Array.isArray(agreementsData.data.agreements)) {
      return { filteredAgreements: [], displayRows: [] };
    }

    const allAgreements = agreementsData.data.agreements;

    // Handle transactions tab separately
    if (activeTab === 'transactions') {
      const txAgreements = allAgreements.filter(a => (a as any).blockchain?.transactionHash);
      const rows = txAgreements.map(a => ({
        ...agreementToRow(a),
        transactionHash: (a as any).blockchain.transactionHash
      }));
      return { filteredAgreements: txAgreements, displayRows: rows };
    }

    // Get the statuses for the current tab
    const statuses = getStatusesForTab(activeTab);
    
    // Filter agreements by status
    const filtered = allAgreements.filter(a => statuses.includes(a.status));
    
    // Convert to display rows
    const rows = filtered.map(agreementToRow);
    
    return { filteredAgreements: filtered, displayRows: rows };
  }, [agreementsData, activeTab]);

  // Update state when filtered data changes
  React.useEffect(() => {
    setAgreements(filteredAgreements);
    setRows(displayRows);
    setLoading(isLoading);
    setError(apiError ? 'Failed to load agreements' : null);
  }, [filteredAgreements, displayRows, apiError, isLoading]);

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
    // For active contracts, navigate to rules view for client
    if (activeTab === 'activeContract') {
      const agreement = agreements.find(a => a._id === rowId);
      if (!agreement) return;

      navigate('/create-contract/rules', {
        state: {
          agreementId: agreement._id,
          agreement: agreement,
          isClientView: true
        }
      });
      return;
    }

    // Only allow clicking for ongoing contracts tab (priced proposals)
    if (activeTab !== 'ongoingContract') return;

    const agreement = agreements.find(a => a._id === rowId);
    if (!agreement) return;

    // Only navigate if status is priced (developer proposed price)
    if (agreement.status === 'priced') {
      // Navigate to contract review page
      navigate('/create-contract', {
        state: {
          agreementId: agreement._id,
          agreement: agreement,
          isClientView: true
        }
      });
    }
    // rejected/cancelled agreements are visible but not clickable
  };

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
            const isClickable = activeTab === 'transactions' || activeTab === 'activeContract' || (activeTab === 'ongoingContract' && agreement?.status === 'priced');
            
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
