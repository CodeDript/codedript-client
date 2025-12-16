import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeveloperTable.module.css';
import { useUserAgreements } from '../../../query/useAgreements';
import { useGigsByDeveloper } from '../../../query/useGigs';
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

// (Using agreements with blockchain.transactionHash for Transactions tab)

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

  // Filter and transform agreements based on active tab
  const { filteredAgreements, displayRows: agreementRows } = useMemo(() => {
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

  const handleAgreementClick = (rowId: string) => {
    // Navigate to gig view when clicking a gig in 'My Gigs' tab
    if (activeTab === 'myGigs') {
      navigate(`/gigview/${rowId}`);
      return;
    }

    // Handle transactions tab separately - open modal
    if (activeTab === 'transactions') {
      const agreement = filteredAgreements.find(a => a._id === rowId);
      if (agreement && (agreement as any).blockchain?.transactionHash) {
        setSelectedTxHash((agreement as any).blockchain.transactionHash);
        setSelectedBlockchainId((agreement as any).blockchain?.agreementId);
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

    // For agreement tabs, use filtered data from React Query
    setAgreements(filteredAgreements);
    setRows(agreementRows);
    setLoading(agreementsLoading);
    setError(apiError ? 'Failed to load agreements' : null);
  }, [activeTab, gigsQuery.isLoading, gigsQuery.isError, gigsQuery.data, filteredAgreements, agreementRows, agreementsLoading, apiError]);

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
