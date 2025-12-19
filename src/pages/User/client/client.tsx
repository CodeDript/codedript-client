import React from 'react';
import styles from './client.module.css';
import UserHero from '../../../components/hero/UserHero/UserHero';
import UserTable from '../../../components/table/userTabale/UserTable';
import Button1 from '../../../components/button/Button1/Button1';
import Footer from '../../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';


const Client: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <div className={styles.container}>
     
      <UserHero />
      
      {/* Client Contracts Section */}
      <div style={{ margin: '3rem auto', maxWidth: '1200px', padding: '0 2rem' }}>
        <h2 className={styles.dashboardTitle}>My Contracts</h2>
        {(user?.role === 'client') && (
          <div className={styles.createGigBlock}>
            <h3 className={styles.createGigTitle}>Earn With Us, Become a Developer</h3>
            <p className={styles.createGigDesc}>
              Eliminate payment disputes and reduce fees with secure escrowed payments. Post clear deliverables and milestones so clients and developers collaborate with trust and predictability.
            </p>
            <div className={styles.createGigButtonWrapper}>
              <Button1 text="Join" onClick={() => navigate('/Join')} />
            </div>
          </div>
        )}
        <UserTable userId={user?._id} />
      </div>
      <Footer />
    </div>
  );
};

export default Client;