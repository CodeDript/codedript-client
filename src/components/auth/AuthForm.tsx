import { useState } from 'react';
import styles from './AuthForm.module.css';
import { showAlert } from './Alert';
import securityIcon from '../../assets/svg/iconsax-security.svg';
import Button3B from '../button/Button3Black1/Button3Black1';
import MetaMaskLogin from './MetaMaskLogin';
import metaMaskIcon from '../../assets/Login/MetaMask.svg';
import emailIcon from '../../assets/Login/emailicon.svg';
import heroOutlineup from '../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../assets/Login/cardBackgrounddown.svg';

interface AuthFormProps {
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailConnect = () => {
    if (!email) {
      showAlert('Please enter an email address', 'error');
      return;
    }

    setLoading(true);

    // Store email in localStorage
    localStorage.setItem('userEmail', email);
    localStorage.setItem('isLoggedIn', 'true');
    
    showAlert('Email connected successfully!', 'success');
    
    // Close modal after short delay
    setTimeout(() => {
      onClose();
      setLoading(false);
    }, 1000);
  };

  const handleWalletSuccess = () => {
    // Wallet login handled by MetaMaskLogin component
    // Modal will be closed by the component after successful login
  };

  return (
    <div className={styles.authOverlay} onClick={onClose}>
      <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.formOuter}>
          {/* decorative outlines anchored to card */}
          <img src={heroOutlineup} alt="decorative outline" className={`${styles.outline} ${styles.outlineTop}`} />
          <img src={heroOutlinedown} alt="decorative outline" className={`${styles.outline} ${styles.outlineBottom}`} />
          
          <button className={styles.closeBtn} onClick={onClose}>×</button>

          <div className={styles.authHeader}>
            <div className={styles.headerLeft}>
              <img src={securityIcon} alt="security" className={styles.securitySvg} />
              <div>
                <h1 className={styles.formTitle}>Secure Access</h1>
              </div>
            </div >
             
            <p className={styles.formSubtext}>Connect your wallet or sign in with email to access CodeDript</p>
            
          </div>

          <div className={styles.authBody}>
            {/* Wallet section */}
            <div className={styles.card}>
              <div className={styles.cardBadge}>
                Wallet
              </div>
              
              <div className={styles.cardInner}>
                <div className={styles.walletItem}>
                  <div className={styles.walletLeft}>
                    <img src={metaMaskIcon} alt="MetaMask" className={styles.mmIcon} />
                    <div className={styles.walletInfo}>
                      <h3 className={styles.walletTitle}>MetaMask</h3>
                      <p className={styles.walletSub}>Connect using MetaMask</p>
                    </div>
                  </div>
                  <div className={styles.walletRight}>
                    {/* MetaMask login component with context integration */}
                    <MetaMaskLogin
                      onLoginSuccess={handleWalletSuccess}
                      onClose={onClose}
                    />
                  </div>
                  
                </div>
                {!((window as any).ethereum && (window as any).ethereum.isMetaMask) && (
                  <p className={styles.metaMaskNotice}>
                    MetaMask not detected —{' '}
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.metaMaskLink}
                    >
                      <strong>Install MetaMask</strong>
                    </a>
                  </p>
                )}
              </div>
            </div>

            {/* Email section */}
            <div className={styles.card}>
              <div className={styles.cardBadge}>
                Email
              </div>
              <div className={styles.cardInner}>
                <div className={styles.emailTop}>
                  <div className={styles.emailLeft}>
                    <img src={emailIcon} alt="email" className={styles.emailIcon} />
                    <div className={styles.emailInfo}>
                      <h3 className={styles.emailTitle}>Email Access</h3>
                      <p className={styles.emailSub}>Connect using Email</p>
                    </div>
                  </div>
                </div>

                <div className={styles.emailForm}>
                  <label htmlFor="email-input" className={styles.emailLabel}>Enter Email Address :</label>
                  <div className={styles.emailInputRow}>
                    <div className={styles.inputRow}>
                      <input
                        id="email-input"
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className={styles.buttonWrapper}>
                      <Button3B 
                        text={loading ? 'Connecting…' : 'Connect'} 
                        onClick={handleEmailConnect}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.termsText}>
            By connecting, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
