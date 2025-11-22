import React, { useState } from 'react';
import styles from './DeveloperTable.module.css';

export type TabKey = 'myGigs' | 'activeContract' | 'incomingContract' | 'ongoingContract' | 'transactions';

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
}

const sampleData: Record<string, DevRow[]> = {
  myGigs: [
    { id: 'g1', order: '0125', title: 'Website Redesign Project', client: 'Tech Startup Inc.', date: 'Jan 01, 2024', status: 'Active', amount: '5000 ETH' },
    { id: 'g2', order: '0126', title: 'Mobile App Development', client: 'Fintech Solutions', date: 'Jan 15, 2024', status: 'Active', amount: '2500 ETH' },
    { id: 'g3', order: '0127', title: 'Website Redesign Project', client: 'Tooling Co', date: 'Jan 01, 2024', status: 'Active', amount: '6000 ETH' },
    { id: 'g4', order: '0128', title: 'UX / UI Design', client: 'Design Studio', date: 'Jan 01, 2024', status: 'Pending', amount: '5000 ETH' },
    { id: 'g5', order: '0129', title: 'Website Redesign Project', client: 'Tech Startup Inc.', date: 'Feb 07, 2024', status: 'Active', amount: '6700 ETH' },
    { id: 'g6', order: '0130', title: 'Maintenance & Support', client: 'Service Ltd.', date: 'Feb 16, 2024', status: 'Active', amount: '1200 ETH' },
    { id: 'g7', order: '0131', title: 'Landing Page', client: 'RetailCo', date: 'Feb 22, 2024', status: 'Pending', amount: '900 ETH' },
  ],

  activeContract: [
    { id: 'c1', order: '0145', title: 'API Integration', client: 'Acme Corp', date: 'Feb 01, 2024', status: 'Active', amount: '3000 ETH' },
    { id: 'c2', order: '0146', title: 'Payments Module', client: 'PayCo', date: 'Feb 09, 2024', status: 'Active', amount: '4200 ETH' },
    { id: 'c3', order: '0147', title: 'Scaling Improvements', client: 'CloudOps', date: 'Feb 14, 2024', status: 'Active', amount: '5200 ETH' },
  ],

  incomingContract: [
    { id: 'i1', order: '0150', title: 'New Landing Page', client: 'RetailCo', date: 'Mar 01, 2024', status: 'Incoming', amount: '1200 ETH' },
    { id: 'i2', order: '0151', title: 'Marketing Microsite', client: 'AdCo', date: 'Mar 04, 2024', status: 'Incoming', amount: '750 ETH' },
  ],

  ongoingContract: [
    { id: 'o1', order: '0160', title: 'Long term support', client: 'Enterprise X', date: 'Dec 10, 2023', status: 'Ongoing', amount: '10000 ETH' },
    { id: 'o2', order: '0161', title: 'Platform Migration', client: 'LegacyCo', date: 'Nov 11, 2023', status: 'Ongoing', amount: '8700 ETH' },
  ],

  transactions: [
    { id: 't1', order: '0200', title: 'Payout', client: 'Tech Startup Inc.', date: 'Mar 17, 2024', status: 'Paid', amount: '5000 ETH' },
    { id: 't2', order: '0201', title: 'Refund', client: 'RetailCo', date: 'Mar 22, 2024', status: 'Paid', amount: '300 ETH' },
  ]
};

const TabLabel: Record<TabKey, string> = {
  myGigs: 'My Gigs',
  activeContract: 'Active Contract',
  incomingContract: 'Incoming Contract',
  ongoingContract: 'Ongoing Contract',
  transactions: 'Transactions',
};

const DeveloperTable: React.FC<DeveloperTableProps> = ({ developerId }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('myGigs');
  const [rows, setRows] = useState<DevRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulate a fetch for each tab (allows wiring developerId later)
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      // simulate network latency
      await new Promise((r) => setTimeout(r, 220));
      if (cancelled) return;

      // If developerId is provided, filter to simulate per-developer data
      const data = sampleData[activeTab] || [];
      if (developerId) {
        // simple deterministic filter using developerId hash -> keep some items
        const seed = developerId.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0);
        const filtered = data.filter((_, i) => ((i + seed) % 2) === 0);
        setRows(filtered.length ? filtered : data.slice(0, 5));
      } else {
        setRows(data);
      }

      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab, developerId]);

  // NOTE: Replace the sampleData usage with real API calls when ready.
  // Example: if (activeTab === 'myGigs') fetch(`/api/dev/${developerId}/gigs`)

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
        {!loading && rows.length === 0 && (<div className={styles.empty}>No items</div>)}

        {rows.map((r) => (
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

export default DeveloperTable;
