import React, { useState } from 'react';
import styles from './UserTable.module.css';

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

const sampleData: Record<string, DevRow[]> = {


  activeContract: [
    { id: 'c1', order: '0145', title: 'API Integration', client: 'Acme Corp', date: 'Feb 01, 2024', status: 'Active', amount: '3000 ETH' },
    { id: 'c2', order: '0146', title: 'Payments Module', client: 'PayCo', date: 'Feb 09, 2024', status: 'Active', amount: '4200 ETH' },
    { id: 'c3', order: '0147', title: 'Scaling Improvements', client: 'CloudOps', date: 'Feb 14, 2024', status: 'Active', amount: '5200 ETH' },
    { id: 'c4', order: '0148', title: 'Security Audit', client: 'SafeBank', date: 'Feb 22, 2024', status: 'Active', amount: '4200 ETH' },
  ],

  incomingContract: [
    { id: 'i1', order: '0150', title: 'New Landing Page', client: 'RetailCo', date: 'Mar 01, 2024', status: 'Incoming', amount: '1200 ETH' },
        { id: 'i1', order: '0150', title: 'New Landing Page', client: 'RetailCo', date: 'Mar 01, 2024', status: 'Incoming', amount: '1200 ETH' },
  ],

  ongoingContract: [
    { id: 'o1', order: '0160', title: 'Long term support', client: 'Enterprise X', date: 'Dec 10, 2023', status: 'Ongoing', amount: '10000 ETH' },
  ],

  
};

const TabLabel: Record<TabKey, string> = {
 
  activeContract: 'Active Contract',
  incomingContract: 'Incoming Contract',
  ongoingContract: 'Ongoing Contract',
 
};

const UserTable: React.FC<UserTableProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('activeContract');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [loading, setLoading] = useState(false);

  // small mock fetch function - keeps behavior similar to a real API call
  async function fetchMockData(tab: TabKey, id?: string): Promise<DevRow[]> {
    // simulate latency
    await new Promise((r) => setTimeout(r, 200));
    const data = (sampleData as any)[tab] || [];

    if (!id) return data.slice();

    // simulate simple server-side filtering by userId
    const seed = id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
    const filtered = data.filter((_: DevRow, i: number) => ((i + seed) % 2) === 0);
    return filtered.length ? filtered : data.slice(0, Math.min(5, data.length));
  }

  // use a request id to avoid stale responses overwriting newer state
  const requestRef = React.useRef(0);

  React.useEffect(() => {
    const reqId = ++requestRef.current;
    setLoading(true);

    (async () => {
      const data = await fetchMockData(activeTab, userId);
      // only set state if this request is the latest
      if (requestRef.current !== reqId) return;
      setRows(data);
      setLoading(false);
    })();

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
              <button key={key} className={`${styles.tabButton} ${activeTab === key ? styles.tabActive : ''}`} onClick={() => setActiveTab(key)}>
                {TabLabel[key]}
              </button>
            );
          })}
        </div>

        <div className={styles.body}>
          {loading && <div className={styles.loading}>Loading...</div>}
          {!loading && rows.length === 0 && <div className={styles.empty}>No items</div>}

          {rows.map(r => (
            <div className={styles.row} key={r.id}>
              <div className={styles.orderCell}><span className={styles.orderNumber}>{r.order}</span></div>
              <div className={styles.titleCell}>
                <div className={styles.titleMain}>{r.title}</div>
                <div className={styles.reviewer}>with {r.client}</div>
              </div>
              <div className={styles.dateCell}>Created {r.date}</div>
              <div className={styles.statusCell}><span className={`${styles.pill} ${styles['pill-' + (r.status || '').toLowerCase()]}`}>{r.status}</span></div>
              <div className={styles.amountCell}>{r.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
