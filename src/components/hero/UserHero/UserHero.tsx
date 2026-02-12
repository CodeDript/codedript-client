import React from 'react';
import styles from './UserHero.module.css';
import heroOutline from '../../../assets/svg/black base.svg';
import userPlaceholder from '../../../assets/svg/user-placeholder.svg';
import calenderIcon from '../../../assets/svg/calander.svg';
import { useAuthContext } from '../../../context/AuthContext';

const UserHero: React.FC = () => {
  const { user } = useAuthContext();

  // Format wallet address for display
  const formatWalletAddress = (address: string | undefined) => {
    if (!address) return 'Pending';
    return `${address.slice(0, 5)}...${address.slice(-6)}`;
  };

  // Format member since date
  const formatMemberSince = (dateString: Date | string | undefined) => {
    if (!dateString) return 'Pending';
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
  };

  return (
    <section className={styles.hero}>
      {/* <img src={heroGrid} alt="hero grid" className={styles.grid} /> */}
      <img src={heroOutline} alt="decorative outline" className={styles.outline} />
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <p className={styles.overline}>
          {user?.role === 'developer' ? 'Developer' : 'Client'}
        </p>

        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatarFrame}>
              <img
                src={user?.avatar || userPlaceholder}
                alt="Profile"
                className={styles.avatarImg}
                onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = userPlaceholder; }}
              />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>
                {user?.fullname || 'Pending'}
              </h2>
              <div className={styles.profileMeta}>

                <div className={styles.metaItem}>
                  <img src={calenderIcon} alt="member since" className={styles.metaIcon} />
                  <span className={styles.metaText}>
                    {formatMemberSince(user?.memberSince)}
                  </span>
                </div>
              </div>
              {user?.email && <p className={styles.title}>{user.email}</p>}
              <p className={styles.earnings}>
                {formatWalletAddress(user?.walletAddress)}
              </p>
              <p className={styles.bio}>
                {user?.bio || 'Pending'}
              </p>
            </div>
          </div>


        </div>

      </div>
    </section>
  );
};

export default UserHero;
