import React from 'react';
import styles from './developer.module.css';
import DeveloperHero from '../../../components/hero/DeveloperHero/DeveloperHero';
import DeveloperTable from '../../../components/table/developerTabale/DeveloperTable';
import Button1 from '../../../components/button/Button1/Button1';
import Footer from '../../../components/footer/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../context/AuthContext';


const Developer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  if (!user) {
    return <div className={styles.container}><p>Please log in to view your profile</p></div>;
  }

  // Map server user fields to DeveloperHero props
  const userName = user.fullname || (user as any).profile?.name || 'Anonymous';
  const userImage = user.avatar || (user as any).profile?.avatar;
  const skills = user.skills || (user as any).profile?.skills || [];
  const bio = user.bio || (user as any).profile?.bio || 'No bio available';
  const memberSince = (user as any).memberSince || (user as any).createdAt;
  const walletAddress = user.walletAddress;
  const rating = (user as any).reputation?.rating || 0;
  const reviewCount = (user as any).reputation?.reviewCount || 0;
  const userRoleLabel = user.role ;

  return (
    <div className={styles.container}>
      <DeveloperHero
        userName={userName}
        userImage={userImage}
        rating={rating}
        reviewCount={reviewCount}
        userRole={userRoleLabel}
        skills={skills}
        bio={bio}
        memberSince={memberSince}
        walletAddress={walletAddress}
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
            {(user.role === 'developer') && (
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