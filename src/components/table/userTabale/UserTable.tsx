import React, { useState } from 'react';
import styles from './UserTable.module.css';
import { AgreementService, type Agreement } from '../../../api/agreementService';

export type TabKey = 'activeContract' | 'incomingContract' | 'ongoingContract';

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
}

const TabLabel: Record<TabKey, string> = {
  activeContract: 'Active Contract',
  incomingContract: 'Incoming Contract',
  ongoingContract: 'Ongoing Contract',
};

// Map tab keys to agreement statuses
const getStatusesForTab = (tab: TabKey): string[] => {
  switch (tab) {
    case 'activeContract':
      return ['active', 'in_progress', 'escrow_deposit'];
    case 'incomingContract':
      return ['pending_developer', 'pending_client', 'pending_signatures'];
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
    client: agreement.developer.profile.name || agreement.developer.email,
    date,
    status: getDisplayStatus(agreement.status),
    amount: `${agreement.financials.totalValue} ${agreement.financials.currency}`
  };
};

const UserTable: React.FC<UserTableProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('activeContract');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // use a request id to avoid stale responses overwriting newer state
  const requestRef = React.useRef(0);

  React.useEffect(() => {
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
            role: 'client',
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

          {!loading && !error && rows.map(r => (
            <div className={styles.row} key={r.id}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
