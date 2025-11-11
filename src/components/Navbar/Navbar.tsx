/**
 * Quick Wheel Vehicle Rental App Component
 * Component: Navbar
 * Description: Navigation bar with logo, menu links, and user authentication controls
 * Tech: React + TypeScript + CSS Modules
 * Behavior:
 * - Shows logo on the left
 * - Center navigation links (Home, Ads, Create Ads)
 * - Right side shows Login button or user profile dropdown
 * - Mobile responsive with hamburger menu
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';
import QuickWheelLogo from '../../assets/images/quickWheelLogo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo} onClick={closeMenus}>
          <img src={QuickWheelLogo} alt="Quick Wheel" className={styles.logoIcon} />
          <span className={styles.logoText}>Quick Wheel</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          <Link to="/ads" className={styles.navLink}>
            Ads
          </Link>
          {isLoggedIn && (
            <Link to="/create-ad" className={styles.navLink}>
              Create Ad
            </Link>
          )}
        </div>

        {/* User Authentication */}
        <div className={styles.authSection}>
          {isLoggedIn ? (
            <div className={styles.profileDropdown}>
              <button
                className={styles.profileButton}
                onClick={toggleProfileDropdown}
                aria-label="User menu"
              >
                <span className={styles.profileIcon}>👤</span>
                <span className={styles.profileName}>{user?.name}</span>
                <span className={styles.dropdownArrow}>
                  {isProfileDropdownOpen ? '▲' : '▼'}
                </span>
              </button>
              
              {isProfileDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link 
                    to="/profile" 
                    className={styles.dropdownItem}
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <button 
                    className={styles.dropdownItem}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/" className={styles.mobileNavLink} onClick={closeMenus}>
            Home
          </Link>
          <Link to="/ads" className={styles.mobileNavLink} onClick={closeMenus}>
            Ads
          </Link>
          {isLoggedIn && (
            <Link to="/create-ad" className={styles.mobileNavLink} onClick={closeMenus}>
              Create Ad
            </Link>
          )}
          
          <div className={styles.mobileAuth}>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className={styles.mobileNavLink} onClick={closeMenus}>
                  Profile ({user?.name})
                </Link>
                <button className={styles.mobileLogoutButton} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={styles.mobileLoginButton} onClick={closeMenus}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;