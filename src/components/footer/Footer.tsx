import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Footer.module.css'; 
import Facebook from '../../assets/FooterImage/facebook.png'; 
import Instagram from '../../assets/FooterImage/instagram.png';
import Twitter from '../../assets/FooterImage/twitter.png';
import Linkedin from '../../assets/FooterImage/linkedin.png';
import Logo from '../../assets/FooterImage/logo.svg';


const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId: string) => {
    if (location.pathname === '/') {
      // If already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Navigate to home page first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  return (
    <footer className={styles.footer}>

      <div className={styles['footer-container']}>
        <div className={styles['brand-info']}>
          <img src={Logo } alt="Logo" />
          <p style={{ fontFamily: "'Jura', sans-serif", fontWeight: 100 }}>Create, sign, and manage freelance agreements with blockchain 
security. Automated escrow, milestone tracking, and instant payments
 for the modern workforce.</p>
        </div>

        <div className={styles['footer-links']}>
          <div className={styles['links-column']}>
            <h4>Information</h4>
            <ul>
              <li><a onClick={() => handleScrollToSection('about')} style={{ cursor: 'pointer' }}>About Us</a></li>
              <li><Link to="/coming-soon">Contact Us</Link></li>
              <li><Link to="/coming-soon">Careers</Link></li>
              <li><Link to="/coming-soon">Press / Media</Link></li>
            </ul>
          </div>

          <div className={styles['links-column']}>
            <h4>Legal & Compliance</h4>
            <ul>
              <li><Link to="/coming-soon">Terms of Service</Link></li>
              <li><Link to="/coming-soon">Privacy Policy</Link></li>
              <li><Link to="/coming-soon">Cookie Policy</Link></li>
              <li><Link to="/coming-soon">Disclaimer</Link></li>
            </ul>
          </div>

          <div className={styles['links-column']}>
            <h4>Community Guidelines</h4>
            <ul>
              <li><Link to="/coming-soon">User Agreement</Link></li>
              <li><Link to="/coming-soon">Privacy Notice</Link></li>
              <li><Link to="/coming-soon">Cookie Preferences</Link></li>
              <li><Link to="/coming-soon">Transparency Disclosure</Link></li>
              <li><Link to="/coming-soon">Regulatory Compliance</Link></li>
            </ul>
          </div>

          <div className={styles['links-column']}>
            <h4>Support</h4>
            <ul>
              <li><Link to="/coming-soon">FAQs</Link></li>
              <li><Link to="/coming-soon">Help Center</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles['footer-media-icon']}>
        <a href="#"><img src={Facebook} alt="Facebook" /></a>
        <a href="#"><img src={Instagram} alt="Instagram" /></a>
        <a href="#"><img src={Twitter} alt="Twitter" /></a>
        <a href="#"><img src={Linkedin} alt="LinkedIn" /></a>
      </div>

      <div className={styles['footer-bottom']}>
        <div className={styles['footer-bottom-text']}>
          <p>© CORZERO (Pvt) Ltd. – All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
