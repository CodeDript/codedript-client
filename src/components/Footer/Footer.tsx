import React from 'react';
import styles from './Footer.module.css';
import Facebook from '../../assets/images/facebook.png'; 
import Instagram from '../../assets/images/instagram.png';
import Twitter from '../../assets/images/twitter.png';
import Linkedin from '../../assets/images/linkedin.png';
import Quickwheel from '../../assets/images/QUICK-WHEEL.svg';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.brandInfo}>
          <img src={Quickwheel} alt="Quick Wheel Logo" className={styles.logoImage} />
          {/* <p>Your trusted partner for quick, convenient, and affordable vehicle rentals. From scooters to cars, we've got you covered.</p> */}
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.linksColumn}>
            <h4>More from Quick Wheel</h4>
            <ul>
              <li><a href="/rent-fast">Rent fast</a></li>
              <li><a href="/membership">Membership</a></li>
              <li><a href="/banner-ads">Banner Ads</a></li>
              <li><a href="/boost-ad">Boost Ad</a></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4>Help & support</h4>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/stay-safe">Stay Safe</a></li>
              <li><a href="/banner-ads">Banner Ads</a></li>
              <li><a href="/connect-us">Connect Us</a></li>
            </ul>
          </div>

          <div className={styles.linksColumn}>
            <h4>About Quick Wheel</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/terms">Terms and Condition</a></li>
              <li><a href="/privacy">Privacy policy</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.footerMediaIcon}>
        <a href="#" aria-label="Facebook">
          <img src={Facebook} alt="Facebook" />
        </a>
        <a href="#" aria-label="Instagram">
          <img src={Instagram} alt="Instagram" />
        </a>
        <a href="#" aria-label="Twitter">
          <img src={Twitter} alt="Twitter" />
        </a>
        <a href="#" aria-label="LinkedIn">
          <img src={Linkedin} alt="LinkedIn" />
        </a>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomText}>
          <p>© 2025 COREZERO. All Rights Reserved. | Ride Smart, Rent Easy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;