import { useState } from 'react';
import styles from './AuthForm.module.css';
import { showAlert } from './Alert';
import securityIcon from '../../assets/svg/iconsax-security.svg';
import Button3B from '../button/Button3Black1/Button3Black1';
import metaMaskIcon from '../../assets/Login/MetaMask.svg';
import emailIcon from '../../assets/Login/emailicon.svg';
import heroOutline from '../../assets/Login/cardBackground.svg';

interface AuthFormProps {
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      setTimeout(() => {
        const token = 'email-' + Date.now();
        onLoginSuccess(token);
        showAlert('Email connected successfully!', 'success');
        setLoading(false);
      }, 1000);
    } catch (error) {
      showAlert('Authentication failed', 'error');
      setLoading(false);
    }
  };

  const handleEmailConnect = () => {
    if (!email) {
      showAlert('Please enter an email address', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const token = 'email-' + Date.now();
      onLoginSuccess(token);
      showAlert('Email connected successfully!', 'success');
      setLoading(false);
    }, 900);
  };

  const connectWallet = () => {
    setLoading(true);
    setTimeout(() => {
      const token = 'wallet-' + Date.now();
      onLoginSuccess(token);
      showAlert('Wallet connected successfully!', 'success');
      setLoading(false);
    }, 800);
  };

  return (
    <div className={styles.authOverlay} onClick={onClose}>
      <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
        <img src={heroOutline} alt="decorative outline" className={styles.outline} />
        
        <div className={styles.formOuter}>
          
          <button className={styles.closeBtn} onClick={onClose}>×</button>

          <div className={styles.authHeader}>
            <div className={styles.headerLeft}>
              <img src={securityIcon} alt="security" className={styles.securitySvg} />
              <div>
                <h1 className={styles.formTitle}>Secure Access</h1>
              </div>
            </div>
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
                      <p className={styles.walletSub}>Connect using MetaMask browser extension</p>
                    </div>
                  </div>
                  <div className={styles.walletRight}>
                    <Button3B text={loading ? 'Connecting…' : 'Connect'} onClick={connectWallet} />
                  </div>
                </div>
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

                <form onSubmit={handleSubmit} className={styles.emailForm}>
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
                      <Button3B text={loading ? 'Loading…' : 'Connect'} onClick={handleEmailConnect} />
                    </div>
                  </div>
                </form>
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
