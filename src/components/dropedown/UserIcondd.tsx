import React, { useEffect, useState } from 'react';
import styles from './UserIcondd.module.css';
import imgProfile from '../../assets/Navimage/sia croven.jpg';
import fallbackImg from '../../assets/Navimage/no_user.jpg';
import { useNavigate } from "react-router-dom";

const UserIconDropdown: React.FC<{ onClose: () => void; onLogout: () => void }> = ({ onClose, onLogout }) => {
    const [isHiding, setIsHiding] = useState(false);
    const navigate = useNavigate();

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
                <img
                    src={imgProfile}
                    alt="preview"
                    className={styles.profileImage}
                    onError={(e) => { e.currentTarget.src = fallbackImg; }}
                />
                <p className={styles.dropdownToggle}>sia croven</p>
            </div>

            <div className={styles.dropdownSection}>
                <button
                    className={styles.dropdownItem}
                    onClick={() => {
                        navigate("/userAccount");
                        onClose();
                    }}
                >
                    <span className={styles.grayIcon}><img src="src/assets/DropdownIcon/user.png" alt="user" /></span> Your profile
                </button>

                <button className={styles.dropdownItem}>
                    <span className={styles.grayIcon}><img src="src/assets/DropdownIcon/nft icon.png" alt="preview" /></span> Your NFTs
                </button>

                <button className={styles.dropdownItem}>
                    <span className={styles.grayIcon}><img src="src/assets/DropdownIcon/cart .png" alt="shopping cart" /></span> You Bought
                </button>
            </div>

            <div className={styles.dropdownSection}>
                <button className={styles.dropdownItem}   onClick={() => {handleClose(); navigate('/dashboard');}}>
                    <span className={styles.grayIcon}><img src="src/assets/DropdownIcon/application.png" alt="preview" /></span> Dashboard
                </button>
            </div>

            <div className={styles.dropdownSection}>
                <button className={styles.dropdownButton} onClick={onLogout}>
                    <span className={styles.redIcon}><img src="src/assets/DropdownIcon/sign out option.png" alt="sign out" /></span> Sign out
                </button>
            </div>
        </div>
    );
};

export default UserIconDropdown;
