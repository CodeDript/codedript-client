import React, { useEffect, useState } from 'react';
import styles from './UserIcondd.module.css';
import userPlaceholder from '../../assets/svg/user-placeholder.svg';
import userIcon from '../../assets/DropdownIcon/user.png';
import nftIcon from '../../assets/DropdownIcon/nft icon.png';
import settingsIcon from '../../assets/DropdownIcon/gear.svg';
import dashboardIcon from '../../assets/DropdownIcon/application.png';
import signOutIcon from '../../assets/DropdownIcon/sign out option.png';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../../context/AuthContext';
import { authApi } from '../../api';


const UserIconDropdown: React.FC<{ onClose: () => void; onLogout: () => void; userRole: string }> = ({ onClose, onLogout, userRole }) => {
    const [isHiding, setIsHiding] = useState(false);
    const navigate = useNavigate();
    const { user, setUser } = useAuthContext();

    const handleClose = () => {
        setIsHiding(true);
        setTimeout(() => { onClose(); }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.querySelector(`.${styles.dropdownMenu}`);
            if (dropdown && !dropdown.contains(event.target as Node)) {
                handleClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`${styles.dropdownMenu} ${isHiding ? styles.fadeOut : styles.fadeIn}`}>
            <div className={styles.userProfile}>
                <div className={styles.avatarFrameSmall}>
                    <img
                        src={user?.avatar || userPlaceholder}
                        alt={user?.fullname || 'profile'}
                        className={styles.avatarImgSmall}
                        onError={(e) => { const t = e.currentTarget as HTMLImageElement; t.onerror = null; t.src = userPlaceholder; }}
                    />
                </div>
                <p className={styles.dropdownToggle}>{user?.fullname || 'Anonymous'}</p>
            </div>

            <div className={styles.dropdownSection}>
                <button
                    className={styles.dropdownItem}
                    onClick={async () => {
                        try {
                            // Fetch latest user data from API
                            const response = await authApi.getMe();
                            const userData = response?.user;
                            
                            if (userData) {
                                // Update user in context
                                setUser(userData);
                                
                                // Navigate based on role
                                const role = userData.role;
                                if (role === 'developer') {
                                    navigate('/developer');
                                } else if (role === 'client') {
                                    navigate('/client');
                                } else {
                                    navigate('/client'); // default
                                }
                            } else {
                                // If no user data, navigate based on stored role
                                navigate(userRole === 'developer' ? '/developer' : '/client');
                            }
                            
                            onClose();
                        } catch (error) {
                            // Fallback to stored role
                            navigate(userRole === 'developer' ? '/developer' : '/client');
                            onClose();
                        }
                    }}
                >
                    <span className={styles.grayIcon}><img src={userIcon} alt="user" /></span> Your profile
                </button>

                <button className={styles.dropdownItem}>
                    <span className={styles.grayIcon}><img src={nftIcon} alt="preview" /></span> Your NFTs
                </button>

                <button className={styles.dropdownItem} onClick={() => {handleClose(); navigate('/settings');}}>
                    <span className={styles.grayIcon}><img src={settingsIcon} alt="settings" /></span> Settings
                </button>
            </div>

            <div className={styles.dropdownSection}>
                <button className={styles.dropdownItem}   onClick={() => {handleClose(); navigate('/dashboard');}}>
                    <span className={styles.grayIcon}><img src={dashboardIcon} alt="preview" /></span> Dashboard
                </button>
            </div>

            <div className={styles.dropdownSection}>
                <button className={styles.dropdownButton} onClick={onLogout}>
                    <span className={styles.redIcon}><img src={signOutIcon} alt="sign out" /></span> Sign out
                </button>
            </div>
        </div>
    );
};

export default UserIconDropdown;
