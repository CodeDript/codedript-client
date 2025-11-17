import { useState, useEffect } from "react";
import styles from "./NavBar.module.css";
import UserIconDropdown from '../dropedown/UserIcondd';
import { useNavigate, useLocation } from "react-router-dom";

type NavBarProps = {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
};


function NavBar({ onLoginClick, isLoggedIn, onLogout }: NavBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeButton, setActiveButton] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    const navButtons = [
        { label: "Home", path: "/" },
        { label: "Marketplace", path: "/marketplace" },
        { label: "Live Auctions", path: "/liveauctions" },
        { label: "Digital Arts", path: "/digitalarts" },
        { label: "Photographs", path: "/photographs" },
    ];

    // Highlight the correct nav button based on current path, otherwise no highlight
    useEffect(() => {
        // Only highlight if on a known nav button path, otherwise clear highlight
        const found = navButtons.find(btn =>
            location.pathname === btn.path ||
            (btn.path !== "/" && location.pathname.startsWith(btn.path))
        );
        setActiveButton(found ? found.label : "");
    }, [location.pathname]);

    const handleDropDownClick = () => setIsDropdownOpen((prev) => !prev);
    const handleDropdownClose = () => setIsDropdownOpen(false);

    return (
        <div className={styles.NavBar}>
            <img src="src/assets/FooterImage/logo.svg" className={styles.pixoraIcon} alt="code dript Logo" />
            
            <button 
                className={`${styles.burgerButton} ${isMobileMenuOpen ? styles.burgerOpen : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`${styles.NavBarButtons} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                {navButtons.map((btn) => (
                    <div
                        key={btn.label}
                        className={`${styles.NavButton} ${activeButton === btn.label ? styles.activeNavButton : ""}`}
                        onClick={() => {
                            navigate(btn.path);
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        {btn.label}
                    </div>
                ))}
                
                {/* Mobile Profile Section */}
                <div className={styles.mobileProfileSection}>
                    {!isLoggedIn ? (
                        <button className={`${styles.loginButton} ${styles.mobileLoginButton}`} onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}>
                            <div className={styles.textWrapper}>Login</div>
                        </button>
                    ) : (
                        <div className={styles.mobileProfileItems}>
                            <div className={styles.mobileProfileItem} onClick={() => { navigate("/userAccount"); setIsMobileMenuOpen(false); }}>
                                <span className={styles.mobileIcon}><img src="src/assets/DropdownIcon/user.png" alt="user" /></span>
                                Your Profile
                            </div>
                            <div className={styles.mobileProfileItem} onClick={() => { setIsMobileMenuOpen(false); }}>
                                <span className={styles.mobileIcon}><img src="src/assets/DropdownIcon/nft icon.png" alt="nft" /></span>
                                Your NFTs
                            </div>
                            <div className={styles.mobileProfileItem} onClick={() => { setIsMobileMenuOpen(false); }}>
                                <span className={styles.mobileIcon}><img src="src/assets/DropdownIcon/cart .png" alt="cart" /></span>
                                You Bought
                            </div>
                            <div className={styles.mobileProfileItem} onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}>
                                <span className={styles.mobileIcon}><img src="src/assets/DropdownIcon/application.png" alt="dashboard" /></span>
                                Dashboard
                            </div>
                            <div className={`${styles.mobileProfileItem} ${styles.signOutButton}`} onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}>
                                <span className={styles.mobileIconRed}><img src="src/assets/DropdownIcon/sign out option.png" alt="sign out" /></span>
                                Sign Out
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Desktop Profile Section */}
            <div className={styles.desktopProfileSection}>
                {!isLoggedIn ? (
                    <button className={styles.loginButton} onClick={onLoginClick}>
                        <div className={styles.textWrapper}>Login</div>
                    </button>
                ) : (
                    <div className={styles.profileContainer}>
                        <button className={styles.profileButton} onClick={handleDropDownClick}>
                        <img src="src/assets/Navimage/User icon.png" className={styles.UserIcon} alt="Profile" />
                        </button>
                        {isDropdownOpen && (
                            <UserIconDropdown onClose={handleDropdownClose} onLogout={onLogout} />
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

export default NavBar;