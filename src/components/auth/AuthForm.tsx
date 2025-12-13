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
import { useRequestOTP, useVerifyOTP } from '../../query/useAuth';
import { useAuthContext } from '../../context/AuthContext';

interface AuthFormProps {
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { mutate: requestOTP, isPending } = useRequestOTP();
  const { mutate: verifyOTP, isPending: isVerifying } = useVerifyOTP();
  const { setUser, setToken } = useAuthContext();

  const handleEmailConnect = () => {
    if (!email) {
      showAlert('Please enter an email address', 'error');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }

    requestOTP(
      { email },
      {
        onSuccess: (response) => {
          showAlert(response.message || 'OTP sent successfully to your email!', 'success');
          // Show OTP input field
          setShowOtpInput(true);
        },
        onError: (error: any) => {
          console.error('Request OTP Error:', error);
          const errorMessage = 
            error?.response?.data?.error?.message || 
            error?.response?.data?.message || 
            error?.message || 
            'Failed to send OTP. Please try again.';
          showAlert(errorMessage, 'error');
        },
      }
    );
  };

  const handleVerifyOTP = () => {
    if (!otp) {
      showAlert('Please enter the OTP code', 'error');
      return;
    }

    if (otp.length !== 6) {
      showAlert('OTP must be 6 digits', 'error');
      return;
    }

    verifyOTP(
      { email, otp },
      {
        onSuccess: (response) => {
          showAlert(response.message || 'Email verified successfully!', 'success');
          // Update auth context
          if (response.data?.user) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
          if (response.data?.token) {
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
          }
          // Close modal and reload to update navbar
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1000);
        },
        onError: (error: any) => {
          console.error('Verify OTP Error:', error);
          const errorMessage = 
            error?.response?.data?.error?.message || 
            error?.response?.data?.message || 
            error?.message || 
            'Invalid OTP. Please try again.';
          showAlert(errorMessage, 'error');
        },
      }
    );
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
            {!showOtpInput && (
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
            )}

            {/* Email section */}
            {!showOtpInput && (
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
                        disabled={showOtpInput}
                      />
                    </div>
                    <div className={styles.buttonWrapper}>
                      <Button3B 
                        text={isPending ? 'Sending...' : 'Connect'} 
                        onClick={handleEmailConnect}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* OTP Verification section - shown after email OTP is sent */}
            {showOtpInput && (
              <div className={styles.card}>
                <div className={styles.cardBadge}>
                  Verify OTP
                </div>
                <div className={styles.cardInner}>
                  <div className={styles.emailTop}>
                    <div className={styles.emailLeft}>
                      <img src={emailIcon} alt="verify" className={styles.emailIcon} />
                      <div className={styles.emailInfo}>
                        <h3 className={styles.emailTitle}>Verify Your Email</h3>
                        <p className={styles.emailSub}>Enter the 6-digit code sent to {email}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.emailForm}>
                    <label htmlFor="otp-input" className={styles.emailLabel}>Enter OTP Code :</label>
                    <div className={styles.emailInputRow}>
                      <div className={styles.inputRow}>
                        <input
                          id="otp-input"
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          autoFocus
                        />
                      </div>
                      <div className={styles.buttonWrapper}>
                        <Button3B 
                          text={isVerifying ? 'Verifying...' : 'Verify'} 
                          onClick={handleVerifyOTP}
                        />
                      </div>
                    </div>
                    <p className={styles.otpNote}>
                      Didn't receive the code?{' '}
                      <button 
                        className={styles.resendBtn}
                        onClick={handleEmailConnect}
                        disabled={isPending}
                      >
                        {isPending ? 'Sending...' : 'Resend OTP'}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}
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
