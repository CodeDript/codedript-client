import React from 'react';
import styles from './client.module.css';
import UserHero from '../../../components/hero/UserHero/UserHero';
import UserTable from '../../../components/table/userTabale/UserTable';
import { useAuth } from '../../../context/AuthContext';

const Client: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      <UserHero />
      
      {/* Client Contracts Section */}
      <div style={{ margin: '3rem auto', maxWidth: '1200px', padding: '0 2rem' }}>
        <h2>My Contracts</h2>
        <UserTable userId={user?._id} />
      </div>
    </div>
  );
};

export default Client;
