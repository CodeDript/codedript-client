import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserTable.module.css';
import { useUserAgreements } from '../../../query/useAgreements';
import { useTransactionsByUser } from '../../../query/useTransactions';
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

const UserTable: React.FC<UserTableProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('activeContract');
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(null);
  const [selectedBlockchainId, setSelectedBlockchainId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // Fetch agreements using React Query
  const { data: agreementsData, isLoading, error: apiError } = useUserAgreements();
  // Fetch actual transactions for the transactions tab
  const { data: transactionsData, isLoading: txLoading, error: txError } = useTransactionsByUser();

  // Build rows for agreement tabs (Active / Ongoing)
  const { filteredAgreements, agreementRows } = useMemo(() => {
    if (!agreementsData?.data?.agreements || !Array.isArray(agreementsData.data.agreements)) {
      return { filteredAgreements: [], agreementRows: [] };
    }

    const allAgreements = agreementsData.data.agreements;
    const statuses = getStatusesForTab(activeTab);
    const filtered = allAgreements.filter(a => statuses.includes(a.status));
    const rows = filtered.map(agreementToRow);
    return { filteredAgreements: filtered, agreementRows: rows };
  }, [agreementsData, activeTab]);

  // Build rows for the transactions tab from real transaction data
  const transactionRows: DevRow[] = useMemo(() => {
    if (activeTab !== 'transactions') return [];
    const txList = transactionsData?.data?.transactions;
    if (!txList || !Array.isArray(txList)) return [];

    return txList.map((tx: any) => {
      const agrmt = tx.agreement && typeof tx.agreement === 'object' ? tx.agreement : null;
      const partnerEmail = agrmt?.developer?.email || agrmt?.client?.email || '';
      return {
        id: tx._id,
        order: tx.transactionID || tx._id.slice(-4).toUpperCase(),
        title: agrmt?.title || 'Untitled',
        client: partnerEmail,
        date: tx.timestamp || new Date(tx.createdAt || '').toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
        amount: `${tx.price} ETH`,
        transactionHash: tx.transactionHash,
      } as DevRow;
    });
  }, [transactionsData, activeTab]);

  // Derive final display values based on active tab
  const rows = activeTab === 'transactions' ? transactionRows : agreementRows;
  const agreements = filteredAgreements;
  const loading = activeTab === 'transactions' ? txLoading : isLoading;
  const error = activeTab === 'transactions'
    ? (txError ? 'Failed to load transactions' : null)
    : (apiError ? 'Failed to load agreements' : null);

  const handleAgreementClick = (rowId: string) => {
    // Handle transactions tab separately - open modal with the tx hash
    if (activeTab === 'transactions') {
      const txRow = transactionRows.find(r => r.id === rowId);
      if (txRow?.transactionHash) {
        setSelectedTxHash(txRow.transactionHash);
        setSelectedBlockchainId(undefined);
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
                  // Transactions tab: show transaction hash, date, type, and amount
                  <>
                    <div className={styles.orderCell}>
                      <span className={styles.orderNumber}>{r.order}</span>
                    </div>
                    <div className={styles.titleCell}>
                      <div className={styles.titleMain}>
                        {r.transactionHash ? `${r.transactionHash.slice(0, 6)}...${r.transactionHash.slice(-4)}` : 'N/A'}
                      </div>
                      <div className={styles.reviewer}>{r.title}</div>
                    </div>
                    <div className={styles.dateCell}>{r.date}</div>
                    <div className={styles.statusCell}>
                      <span className={`${styles.pill} ${styles['pill-' + (r.status || '').toLowerCase()]}`}>
                        {r.status}
                      </span>
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
