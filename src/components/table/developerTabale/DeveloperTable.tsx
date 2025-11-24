import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DeveloperTable.module.css';
import { AgreementService, type Agreement } from '../../../api/agreementService';
import { GigService, type Gig } from '../../../api/gigService';
import { useAuth } from '../../../context/AuthContext';

export type TabKey = 'myGigs' | 'activeContract' | 'transactions' | 'ongoingContract';

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
  activeContract: 'Active Contract',
  transactions: 'Transactions',
  ongoingContract: 'Ongoing Contract',
};

// Map tab keys to agreement statuses (for developer role)
const getStatusesForTab = (tab: TabKey): string[] => {
  switch (tab) {
    case 'activeContract':
      return ['active', 'in_progress', 'escrow_deposit'];
    case 'transactions':
      return []; // Transactions are fetched separately
    case 'ongoingContract':
      return ['awaiting_final_approval'];
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
    order: agreement.agreementId || agreement._id.slice(-4).toUpperCase(),
    title: agreement.project.name,
    client: agreement.client?.profile?.name || agreement.client?.email || agreement.clientInfo?.name || 'Unknown Client',
    date,
    status: getDisplayStatus(agreement.status),
    amount: `${agreement.financials.totalValue} ${agreement.financials.currency}`
  };
};

// (Using agreements with blockchain.transactionHash for Transactions tab)

const DeveloperTable: React.FC<DeveloperTableProps> = ({ developerId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('myGigs');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const navigate = useNavigate();

  // prevent stale fetches overwriting UI — use a request token
  const requestRef = React.useRef(0);

  const handleAgreementClick = (rowId: string) => {
    // Don't allow clicking for transactions tab
    if (activeTab === 'transactions') return;
    
    const agreement = agreements.find(a => a._id === rowId);
    if (!agreement) return;
    
    // Navigate to contract page with agreement details for developer to review
    navigate('/create-contract', {
      state: {
        agreementId: agreement._id,
        agreement: agreement,
        isDeveloperView: true
      }
    });
  };

  React.useEffect(() => {
    // Handle myGigs separately (fetch gigs owned by the logged-in developer)
    if (activeTab === 'myGigs') {
      const fetchGigs = async () => {
        const reqId = ++requestRef.current;
        setLoading(true);
        setError(null);

        try {
          // determine developer id from prop or auth context
          const loggedInId = developerId || auth.user?._id;
          if (!loggedInId) {
            setRows([]);
            return;
          }

          // fetch gigs owned by the developer, include inactive so owner sees drafts
          const response = await GigService.getAllGigs({ developer: loggedInId, page: 1, limit: 100, includeInactive: true });
          if (requestRef.current !== reqId) return;

          const gigs: Gig[] = response.data || [];

          const displayRows = gigs.map(g => ({
            id: g._id,
            order: (g.gigId ? g.gigId.toString() : g._id.slice(-4).toUpperCase()),
            title: g.title,
            client: g.developer.profile?.name || g.developer.email,
            date: new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: (g.status || '').replace(/^(.)/, s => s.toUpperCase()),
            amount: g.pricing ? `${g.pricing.amount} ${g.pricing.currency}` : '—'
          }));

          setRows(displayRows);
        } catch (err) {
          if (requestRef.current !== reqId) return;
          console.error('Error fetching gigs:', err);
          setError('Failed to load gigs');
          setRows([]);
        } finally {
          if (requestRef.current === reqId) setLoading(false);
        }
      };

      fetchGigs();
      return;
    }

    // Handle transactions tab separately: fetch agreements that have blockchain transaction hashes
    if (activeTab === 'transactions') {
      const fetchTxFromAgreements = async () => {
        const reqId = ++requestRef.current;
        setLoading(true);
        setError(null);

        try {
          const resp = await AgreementService.getAllAgreements({ role: 'developer', limit: 200 });

          if (requestRef.current !== reqId) return;

          const allAgreements = resp.data || [];
          const txAgreements = allAgreements.filter(a => (a as any).blockchain && (a as any).blockchain.transactionHash);
          const displayRows = txAgreements.map(a => ({
            ...agreementToRow(a),
            transactionHash: (a as any).blockchain.transactionHash
          }));

          setAgreements(txAgreements as Agreement[]);
          setRows(displayRows);
        } catch (err) {
          if (requestRef.current !== reqId) return;
          console.error('Error fetching transactions from agreements:', err);
          setError('Failed to load transactions');
          setRows([]);
        } finally {
          if (requestRef.current === reqId) setLoading(false);
        }
      };

      fetchTxFromAgreements();
      return;
    }

    const fetchAgreements = async () => {
      const reqId = ++requestRef.current;
      setLoading(true);
      setError(null);

      try {
        // Get the statuses for the current tab
        const statuses = getStatusesForTab(activeTab);
        
        // Fetch agreements for each status
        const promises = statuses.map(status =>
          AgreementService.getAllAgreements({ 
            role: 'developer',
            status,
            limit: 100 
          })
        );

        const responses = await Promise.all(promises);
        
        // only set state if this request is the latest
        if (requestRef.current !== reqId) return;

        // Combine all agreements from different statuses
        const allAgreements = responses.flatMap(response => response.data || []);
        
        // Convert to display rows
        const displayRows = allAgreements.map(agreementToRow);
        
        setAgreements(allAgreements);
        setRows(displayRows);
      } catch (err) {
        if (requestRef.current !== reqId) return;
        console.error('Error fetching agreements:', err);
        setError('Failed to load contracts');
        setRows([]);
      } finally {
        if (requestRef.current === reqId) {
          setLoading(false);
        }
      }
    };

    fetchAgreements();

    return () => { /* next call will bump requestRef.current */ };
  }, [activeTab, developerId]);

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
                cursor: activeTab === 'transactions' ? 'default' : 'pointer'
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
    </div>
  );
};

export default DeveloperTable;
