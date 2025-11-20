import { useState } from 'react';
import './AuthForm.css';
import { showAlert } from './Alert';
import securityIcon from '../../assets/svg/iconsax-security.svg';
import Button3B from '../button/Button3Black1/Button3Black1';
import metaMaskIcon from '../../assets/Login/MetaMask.svg';
import emailIcon from '../../assets/Login/emailicon.svg';

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
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-outer">
          <button className="close-btn" onClick={onClose}>×</button>

          <div className="auth-header">
            <div className="header-left">
              <img src={securityIcon} alt="security" className="security-svg" />
              <div>
                <h1 className="form-title">Secure Access</h1>
                
              </div>
              
            </div>
            <p className="form-subtext">Connect your wallet or sign in with email to access CodeDript</p>
          </div>

          <div className="auth-body">
            {/* Wallet section */}
            <div className="card wallet-card">
              <div className="card-badge">
               
                Wallet
              </div>
              <div className="card-inner">
                <div className="wallet-item">
                  <div className="wallet-left">
                    <img src={metaMaskIcon} alt="MetaMask" className="mm-icon" />
                    <div className="wallet-info">
                      <h3 className="wallet-title">MetaMask</h3>
                      <p className="wallet-sub">Connect using MetaMask browser extension</p>
                    </div>
                  </div>
                  <div className="wallet-right">
                  
                    <Button3B text={loading ? 'Connecting…' : 'Connect'} onClick={connectWallet} />
                  </div>
                </div>
              </div>
            </div>

            {/* Email section */}
            <div className="card email-card">
              <div className="card-badge">
           
                Email
              </div>
              <div className="card-inner">
                <div className="email-top">
                  <div className="email-left">
                    <img src={emailIcon} alt="email" className="email-icon" />
                    <div className="email-info">
                      <h3 className="email-title">Email Access</h3>
                      <p className="email-sub">Connect using Email</p>
                    </div>
                  </div>
                 
                </div>

                <form onSubmit={handleSubmit} className="email-form">
                  <label htmlFor="email-input" className="email-label">Enter Email Address :</label>
                  <div className="email-input-row">
                    <div className="input-row email-input-row">
                      <input
                        id="email-input"
                        type="email"
                        placeholder="Enter Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="button-wrapper">
                      <Button3B text={loading ? 'Loading…' : 'Connect'} onClick={handleEmailConnect} />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <p className="terms-text">
            By connecting, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
