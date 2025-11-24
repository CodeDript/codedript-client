import React, { useEffect, useState } from 'react';
import styles from './developer.module.css';
import DeveloperHero from '../../../components/hero/DeveloperHero/DeveloperHero';
import DeveloperTable from '../../../components/table/developerTabale/DeveloperTable';
import { useAuth } from '../../../context/AuthContext';
import Button1 from '../../../components/button/Button1/Button1';
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
      
      {/* Developer Dashboard Section */}
      <div style={{ margin: '3rem auto', maxWidth: '1200px', padding: '0 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <h2>Developer Dashboard</h2>
          {(user.role === 'developer' || user.role === 'both') && (
            <div style={{ paddingBottom: '30px' }}>
              <Button1 text="Create Gig" onClick={() => navigate('/create-gig')} />
            </div>
          )}
        </div>
        <DeveloperTable developerId={user._id} />
      </div>
    </div>
  );
};

export default Developer;
