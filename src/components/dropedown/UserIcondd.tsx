import React, { useEffect, useState } from 'react';
import styles from './UserIcondd.module.css';
import fallbackImg from '../../assets/Navimage/no_user.jpg';
import userIcon from '../../assets/DropdownIcon/user.png';
import nftIcon from '../../assets/DropdownIcon/nft icon.png';
import cartIcon from '../../assets/DropdownIcon/cart .png';
import dashboardIcon from '../../assets/DropdownIcon/application.png';
import signOutIcon from '../../assets/DropdownIcon/sign out option.png';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

const UserIconDropdown: React.FC<{ onClose: () => void; onLogout: () => void; userRole: string }> = ({ onClose, onLogout, userRole }) => {
    const [isHiding, setIsHiding] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

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
                {user?.profile?.avatar ? (
                    <img
                        src={user.profile.avatar}
                        alt={user.profile.name || 'profile'}
                        className={styles.profileImage}
                        onError={(e) => { e.currentTarget.src = fallbackImg; }}
                    />
                ) : null}
                <p className={styles.dropdownToggle}>{user?.profile?.name || user?.email || 'Anonymous'}</p>
            </div>

            <div className={styles.dropdownSection}>
                <button
                    className={styles.dropdownItem}
                    onClick={() => {
                        navigate(userRole === 'developer' ? '/developer' : '/client');
                        onClose();
                    }}
                >
                    <span className={styles.grayIcon}><img src={userIcon} alt="user" /></span> Your profile
                </button>

                <button className={styles.dropdownItem}>
                    <span className={styles.grayIcon}><img src={nftIcon} alt="preview" /></span> Your NFTs
                </button>

                <button className={styles.dropdownItem}>
                    <span className={styles.grayIcon}><img src={cartIcon} alt="shopping cart" /></span> You Bought
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
