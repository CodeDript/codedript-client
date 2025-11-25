import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import UserIconDropdown from '../dropedown/UserIcondd';
import logo from '../../assets/Navimage/logo.svg';
import userIcon from '../../assets/Navimage/userIcon.svg';
import { useNavigate, useLocation } from "react-router-dom";
import Button2 from '../../components/button/Button2/Button2';
import { useAgreement } from '../../context/AgreementContext';
import { connectWallet } from '../../services/ContractService';

type NavBarProps = {
    isLoggedIn: boolean;
    onLoginClick: () => void;
    onLogout: () => void;
    userRole: string;
};


function NavBar({ onLoginClick, isLoggedIn, onLogout, userRole }: NavBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeButton, setActiveButton] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    // Keep Home and Marketplace, remove the old categories and add three anchors
    // that point to sections on the home page (A feature, Work Flow, About)
    const navButtons = [
        { label: "Home", path: "/" },
        { label: "Marketplace", path: "/all-gigs" },
        { label: "Feature", path: "/#feature" },
        { label: "Work Flow", path: "/#workflow" },
        { label: "About", path: "/#about" },
        { label: "Coming Soon", path: "/coming-soon" },
    ];

    // Highlight the correct nav button based on current path, otherwise no highlight
    useEffect(() => {
        // Highlight based on pathname OR hash (for home anchors like /#feature)
        const found = navButtons.find(btn => {
            // support hash-based entries like '/#feature'
            if (btn.path.includes('#')) {
                const [base, hash] = btn.path.split('#');
                // hash in location (e.g. '#feature')
                if (location.pathname === base && location.hash === `#${hash}`) return true;
                // if on the base path without hash, don't mark as active
                return false;
            }

            if (btn.path === '/') return location.pathname === '/';
            return location.pathname.startsWith(btn.path);
        });

        setActiveButton(found ? found.label : "");
    }, [location.pathname, location.hash]);

    // When the location hash changes, try to smoothly scroll to the element (works for anchors)
    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.replace('#', '');
        // Delay briefly so target exists after navigation
        const t = setTimeout(() => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 60);

        return () => clearTimeout(t);
    }, [location.pathname, location.hash]);

    const handleDropDownClick = () => setIsDropdownOpen((prev) => !prev);
    const handleDropdownClose = () => setIsDropdownOpen(false);

    const { updateFormData } = useAgreement();

    const handleConnectButton = async () => {
        // If user not authenticated, open login modal
        const stored = localStorage.getItem('user');
        if (!stored) {
            onLoginClick();
            return;
        }

        try {
            // Connect MetaMask via ContractService
            const account = await connectWallet();
            const walletAddress = account?.address;
            const userData = JSON.parse(stored);

            // Store client info into AgreementContext
            updateFormData({
                clientWallet: walletAddress,
                clientName: userData?.profile?.name || userData?.email?.split('@')[0] || 'Client',
                clientEmail: userData?.email || ''
            });

            // Do not navigate — keep the user on the same page
            console.log('Navbar: connected wallet', walletAddress);
        } catch (err: any) {
            console.error('Navbar connect wallet error:', err);
            // fallback to open login modal
            onLoginClick();
        }
    };

    return (
        <div className={styles.NavBar}>
            <img src={logo} className={styles.pixoraIcon} alt="code dript Logo" />
            
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
                            // If the button contains a hash (anchor) we try to navigate and set the hash
                            if (btn.path.includes('#')) {
                                // use window.location to update the hash and scroll to the anchor
                                const [base, hash] = btn.path.split('#');
                                // navigate to base first if needed
                                if (location.pathname !== base) navigate(base);
                                // then set the hash — this will update location.hash and cause browser to scroll
                                window.location.hash = `#${hash}`;
                                setIsMobileMenuOpen(false);
                                return;
                            }

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
                            <div className={styles.mobileProfileItem} onClick={() => { navigate(userRole === 'developer' ? '/developer' : '/client'); setIsMobileMenuOpen(false); }}>
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
                    <div className={styles.buttonSection}>
                   <Button2 text="Connect Wallet" onClick={async () => { await handleConnectButton(); setIsMobileMenuOpen(false); }} />
                    </div>
                ) : (
                    <div className={styles.profileContainer}>
                        <button className={styles.profileButton} onClick={handleDropDownClick}>
                        <img src={userIcon} className={styles.UserIcon} alt="Profile" />
                        </button>
                        {isDropdownOpen && (
                            <UserIconDropdown onClose={handleDropdownClose} onLogout={onLogout} userRole={userRole} />
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

export default NavBar;