import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './contractprocessing.module.css';
import Button3Black1 from '../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../components/button/Button2/Button2';
import CardVector from '../../assets/svg/cardvector.svg';
import Lottie from 'lottie-react';
import blockchainAnimation from './blockchain.json';
import { authApi } from '../../api/auth.api';
import { showAlert } from '../auth/Alert';

const ContractProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isConnecting, setIsConnecting] = useState(false);

  // Default values in case page is opened directly
  const { title = 'Package', price = '', delivery = '', revisions = 0, description = [], image = '', gigId, packageId, developerWallet } = (state || {}) as any;

  const connectWalletAndStart = async () => {
    try {
      setIsConnecting(true);

      // Check if token exists in localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        const errorMsg = 'You need to connect to the system. Please login first.';
        showAlert(errorMsg, 'error');
        setIsConnecting(false);
        return;
      }

      // Verify token by calling /auth/me endpoint
      let userData;
      try {
        const response = await authApi.getMe();
        
        // The API returns { success, message, data: { user } }
        userData = response.user;
        
        if (!userData) {
          throw new Error('User data not found in response');
        }

        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData));

        // Ensure the authenticated user is a client
        if (userData.role !== 'client') {
          const roleErr = 'Only clients can start contracts.';
          showAlert(roleErr, 'error');
          setIsConnecting(false);
          return;
        }
      } catch (apiError: any) {

        // Only clear token on authentication errors (401)
        if (apiError.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          showAlert('Your session has expired. Please login again.', 'error');
        } else {
          // For other errors, don't clear the token - might be network issue
          showAlert('Failed to verify credentials. Please try again.', 'error');
        }

        setIsConnecting(false);
        return;
      }

      // Use authenticated user data from API response
      const clientName = userData.fullname || userData.email?.split('@')[0] || 'Client';
      const clientEmail = userData.email || '';

      // Check if wallet is already connected
      let walletAddress = localStorage.getItem('walletAddress');

      if (!walletAddress) {
        // Mock wallet connection
        const mockWallet = '0x' + Math.random().toString(16).substring(2, 42);
        walletAddress = mockWallet;

        // Store wallet in localStorage
        localStorage.setItem('walletAddress', walletAddress);
      }

      // Navigate to create contract with all data
      navigate('/create-contract', { 
        state: { 
          title, 
          price, 
          delivery, 
          revisions, 
          description, 
          image, 
          gigId,
          packageId,
          developerWallet,
          clientWallet: walletAddress,
          clientName: clientName,
          clientEmail: clientEmail
        } 
      });
    } catch (error: any) {
      let errorMsg = '';
      if (error.message?.includes('cancelled') || error.message?.includes('rejected')) {
        errorMsg = 'Connection rejected. Please approve the connection request.';
      } else if (error.message?.includes('not installed')) {
        errorMsg = 'MetaMask is not installed. Please install MetaMask to continue.';
      } else {
        errorMsg = error.message || 'Failed to connect wallet';
      }
      
      showAlert(errorMsg, 'error');
      setIsConnecting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* decorative vector placed into the card background */}
        <img src={CardVector} alt="decorative vector" className={styles.vector} />
        <div className={styles.media}>
          {blockchainAnimation ? (
            <Lottie
              animationData={blockchainAnimation}
              loop
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : image ? (
            <img src={image} alt={title} className={styles.image} />
          ) : (
            <div className={styles.placeholder}>No Image</div>
          )}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.price}>{price}</div>

          <div className={styles.meta}>
            <div>Delivery: <strong>{delivery || '—'}</strong></div>
            <div>Revisions: <strong>{revisions}</strong></div>
          </div>

          <ul className={styles.features}>
            {Array.isArray(description) && description.length > 0 ? (
              description.map((d: string, idx: number) => (
                <li key={idx}>✓ {d}</li>
              ))
            ) : (
              <li>No features provided.</li>
            )}
          </ul>

          {/* Errors are shown via snackbar using showAlert() */}

          <div className={styles.actions}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button2 text="Back" onClick={() => navigate(-1)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button3Black1
                text={isConnecting ? 'Connecting Wallet...' : 'Start Contract'}
                onClick={connectWalletAndStart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractProcessing;
