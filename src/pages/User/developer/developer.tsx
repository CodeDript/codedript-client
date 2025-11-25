import React from 'react';
import styles from './developer.module.css';
import DeveloperHero from '../../../components/hero/DeveloperHero/DeveloperHero';
import DeveloperTable from '../../../components/table/developerTabale/DeveloperTable';
import { useAuth } from '../../../context/AuthContext';
import Button1 from '../../../components/button/Button1/Button1';
import Footer from '../../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';

const Developer: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className={styles.container}><p>Loading profile...</p></div>;
  }

  if (!user) {
    return <div className={styles.container}><p>Please log in to view your profile</p></div>;
  }

  return (
    <div className={styles.container}>
      <DeveloperHero 
        userName={user.profile?.name || 'Anonymous'}
        userImage={user.profile?.avatar}
        rating={user.reputation?.rating || 0}
        reviewCount={user.reputation?.reviewCount || 0}
        userRole={user.role === 'both' ? 'Freelance Client & Developer' : (user.role === 'developer' ? 'Freelance Developer' : 'Freelance Client')}
        skills={user.profile?.skills || []}
        bio={user.profile?.bio || 'No bio available'}
        memberSince={user.createdAt}
        walletAddress={user.walletAddress}
      />
      {/* removed top-level create title/desc — moved under Developer Dashboard below */}
      {/* Developer Dashboard Section */}
      <div style={{ margin: '3rem auto', maxWidth: '1200px', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h2 className={styles.dashboardTitle}>Developer Dashboard</h2>
             <h3 className={styles.createGigTitle}>Create a new gig:</h3>
                <p className={styles.createGigDesc}>
                  Describe your offering clearly and concisely so clients understand value. Set pricing and milestones that reflect the work required. Optimize title, tags and delivery details to improve discoverability.
                </p>
            {(user.role === 'developer' || user.role === 'both') && (
              <div className={styles.createGigBlock}>
               
                <div className={styles.createGigButtonWrapper}>
                  <Button1 text="Create Gig" onClick={() => navigate('/create-gig')} />
                </div>
              </div>
            )}
          </div>
        </div>
        <DeveloperTable developerId={user._id} />
      </div>
      <Footer />
    </div>
  );
};

export default Developer;