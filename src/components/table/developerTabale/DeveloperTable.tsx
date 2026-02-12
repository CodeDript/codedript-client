import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeveloperTable.module.css';
import { useUserAgreements } from '../../../query/useAgreements';
import { useGigsByDeveloper } from '../../../query/useGigs';
import { useTransactionsByUser } from '../../../query/useTransactions';
import type { Agreement } from '../../../types';
import TransactionModal from '../../modal/TransactionModal/TransactionModal';

export type TabKey = 'myGigs' | 'incomingContract' | 'activeContract' | 'transactions' | 'ongoingContract';

interface DeveloperTableProps {
  developerId?: string;
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
  myGigs: 'My Gigs',
  incomingContract: 'Incoming Contract',
  activeContract: 'Active Contract',
  transactions: 'Transactions',
  ongoingContract: 'Ongoing Contract',
};

// Map tab keys to agreement statuses (for developer role)
const getStatusesForTab = (tab: TabKey): string[] => {
  switch (tab) {
    case 'incomingContract':
      return ['pending'];
    case 'activeContract':
      return ['active', 'in-progress', 'completed', 'paid'];
    case 'transactions':
      return []; // Transactions are fetched separately
    case 'ongoingContract':
      return ['priced', 'rejected', 'cancelled'];
    default:
      return [];
  }
};

// Map agreement status to display status
const getDisplayStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Incoming',
    'priced': 'Priced',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'active': 'Active',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'paid': 'Paid'
  };
  return statusMap[status] || status;
}

// Convert Agreement to DevRow for display
const agreementToRow = (agreement: Agreement): DevRow => {
  const date = new Date(agreement.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  // Get client name from populated field
  const clientName = (agreement.client && typeof agreement.client === 'object')
    ? (agreement.client.fullname || agreement.client.email || 'Unknown')
    : 'Unknown';

  return {
    id: agreement._id,
    order: agreement.agreementID || agreement._id.slice(-4).toUpperCase(),
    title: agreement.title || 'Untitled Agreement',
    client: clientName,
    date,
    status: getDisplayStatus(agreement.status),
    amount: `${agreement.financials.totalValue} ETH`
  };
};

const DeveloperTable: React.FC<DeveloperTableProps> = ({ developerId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('myGigs');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTxHash, setSelectedTxHash] = useState<string | null>(null);
  const [selectedBlockchainId, setSelectedBlockchainId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // Mock user from localStorage
  const storedUser = localStorage.getItem('user');
  const mockUser = storedUser ? JSON.parse(storedUser) : null;

  // developer id and query for gigs
  const loggedInId = developerId || mockUser?._id;
  const gigsQuery = useGigsByDeveloper(loggedInId);

  // Fetch agreements using React Query
  const { data: agreementsData, isLoading: agreementsLoading, error: apiError } = useUserAgreements();
  // Fetch actual transactions for the transactions tab
  const { data: transactionsData, isLoading: txLoading, error: txError } = useTransactionsByUser();

  // Filter and transform agreements based on active tab
  const { filteredAgreements, displayRows: agreementRows } = useMemo(() => {
    if (!agreementsData?.data?.agreements || !Array.isArray(agreementsData.data.agreements)) {
      return { filteredAgreements: [], displayRows: [] };
    }

    const allAgreements = agreementsData.data.agreements;
    const statuses = getStatusesForTab(activeTab);
    const filtered = allAgreements.filter(a => statuses.includes(a.status));
    const rows = filtered.map(agreementToRow);
    return { filteredAgreements: filtered, displayRows: rows };
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

  const handleAgreementClick = (rowId: string) => {
    // Navigate to gig view when clicking a gig in 'My Gigs' tab
    if (activeTab === 'myGigs') {
      navigate(`/gigview/${rowId}`);
      return;
    }

    // Handle transactions tab separately - open modal with the tx hash
    if (activeTab === 'transactions') {
      const txRow = transactionRows.find(r => r.id === rowId);
      if (txRow?.transactionHash) {
        setSelectedTxHash(txRow.transactionHash);
        setSelectedBlockchainId(undefined);
      }
      return;
    }

    // Use filteredAgreements instead of agreements state for more reliable data
    const agreement = filteredAgreements.find(a => a._id === rowId);
    if (!agreement) {
      return;
    }

    // For incoming contracts, navigate to payment step (developer sets payment terms)
    if (activeTab === 'incomingContract') {
      // Transform agreement data to match expected structure in contract creation page
      const transformedAgreement = {
        ...agreement,
        project: {
          name: agreement.title,
          description: agreement.description,
          expectedEndDate: agreement.endDate
        },
        clientInfo: typeof agreement.client === 'object' ? {
          name: agreement.client.fullname || '',
          email: agreement.client.email || '',
          walletAddress: agreement.client.walletAddress || ''
        } : undefined,
        developerInfo: typeof agreement.developer === 'object' ? {
          name: agreement.developer.fullname || '',
          email: agreement.developer.email || '',
          walletAddress: agreement.developer.walletAddress || ''
        } : undefined,
        financials: agreement.financials
      };

      navigate('/create-contract', {
        state: {
          agreementId: agreement._id,
          agreement: transformedAgreement,
          isDeveloperView: true
        }
      });
      return;
    }

    // For active contracts, navigate to rules view
    if (activeTab === 'activeContract') {
      navigate('/create-contract/rules', {
        state: {
          agreementId: agreement._id,
          agreement: agreement,
          isDeveloperView: true
        }
      });
      return;
    }
  };

  React.useEffect(() => {
    // Handle myGigs separately (fetch gigs owned by the logged-in developer)
    if (activeTab === 'myGigs') {
      if (gigsQuery.isLoading) {
        setLoading(true);
        setError(null);
        setRows([]);
        return;
      }

      if (gigsQuery.isError) {
        setLoading(false);
        setError('Failed to load gigs');
        setRows([]);
        return;
      }

      const res = gigsQuery.data;
      const gigsList = res?.gigs || [];

      const displayRows = gigsList.map((g: any) => ({
        id: g._id,
        order: String(g.gigID || g._id?.slice(-4)?.toUpperCase() || ''),
        title: g.title,
        client: g.developer?.username || g.developer?.email || g.developer?.walletAddress || 'Unknown',
        date: new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: g.isActive ? 'Active' : 'Inactive',
        amount: g.pricing ? `${g.pricing.amount} ${g.pricing.currency}` : '—'
      }));

      setRows(displayRows);
      setLoading(false);
      return;
    }

    // Handle transactions tab
    if (activeTab === 'transactions') {
      setAgreements([]);
      setRows(transactionRows);
      setLoading(txLoading);
      setError(txError ? 'Failed to load transactions' : null);
      return;
    }

    // For other agreement tabs, use filtered data from React Query
    setAgreements(filteredAgreements);
    setRows(agreementRows);
    setLoading(agreementsLoading);
    setError(apiError ? 'Failed to load agreements' : null);
  }, [activeTab, gigsQuery.isLoading, gigsQuery.isError, gigsQuery.data, filteredAgreements, agreementRows, agreementsLoading, apiError, transactionRows, txLoading, txError]);

  return (
    <div className={styles.tableWrapper1}>
      <div className={styles.tableWrapper}>
        <div className={styles.tabsBar}>
          {Object.keys(TabLabel).map((key) => {
            const k = key as TabKey;
            return (
              <button
                key={k}
                className={`${styles.tabButton} ${activeTab === k ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(k)}
              >
                {TabLabel[k]}
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

          {!loading && !error && rows.map((r) => (
            <div
              className={styles.row}
              key={r.id}
              onClick={() => handleAgreementClick(r.id)}
              style={{
                cursor: 'pointer'
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
          ))}
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

export default DeveloperTable;
