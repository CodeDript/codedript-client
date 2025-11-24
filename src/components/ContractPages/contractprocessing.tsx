import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './contractprocessing.module.css';
import Button3Black1 from '../../components/button/Button3Black1/Button3Black1';
import Button2 from '../../components/button/Button2/Button2';
import CardVector from '../../assets/svg/cardvector.svg';
import Lottie from 'lottie-react';
import blockchainAnimation from './blockchain.json';
import { useAgreement } from '../../context/AgreementContext';
import { connectWallet } from '../../services/ContractService';

const ContractProcessing: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { updateFormData, formData } = useAgreement();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState('');

  // Default values in case page is opened directly
  const { title = 'Package', price = '', delivery = '', revisions = 0, description = [], image = '', gigId, developerWallet } = (state || {}) as any;

  const connectWalletAndStart = async () => {
    console.log('=== connectWalletAndStart called ===');
    try {
      setIsConnecting(true);
      setWalletError('');

      // Check if user is authenticated
      const storedUser = localStorage.getItem('user');
      console.log('Stored user in localStorage:', storedUser);

      if (!storedUser) {
        const errorMsg = 'You must be logged in to create a contract. Please login first.';
        console.error(errorMsg);
        setWalletError(errorMsg);
        setIsConnecting(false);
        return;
      }

      const userData = JSON.parse(storedUser);
      console.log('Parsed user data:', userData);

      // Use authenticated user data from localStorage
      const clientName = userData.profile?.name || userData.email?.split('@')[0] || 'Client';
      const clientEmail = userData.email || '';

      // Check if wallet is already connected (from navbar or previous connection)
      let walletAddress = formData.clientWallet;

      if (!walletAddress) {
        console.log('No wallet connected yet, connecting to MetaMask...');
        
        // Use ContractService to connect wallet (handles ThirdWeb + MetaMask)
        const account = await connectWallet();
        walletAddress = account.address;
        console.log('✅ Connected wallet address:', walletAddress);

        // Store client information in context
        updateFormData({
          clientWallet: walletAddress,
          clientName: clientName,
          clientEmail: clientEmail,
        });
      } else {
        console.log('✅ Wallet already connected:', walletAddress);
        // Ensure client info is stored even if wallet was already connected
        updateFormData({
          clientName: clientName,
          clientEmail: clientEmail,
        });
      }

      console.log('Client details:', { clientName, clientEmail, walletAddress });
      console.log('Navigating to create contract...');
      
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
          developerWallet,
          clientWallet: walletAddress,
          clientName: clientName,
          clientEmail: clientEmail
        } 
      });
    } catch (error: any) {
      console.error('❌ Wallet connection error:', error);
      console.error('Error message:', error.message);
      
      let errorMsg = '';
      if (error.message?.includes('cancelled') || error.message?.includes('rejected')) {
        errorMsg = 'Connection rejected. Please approve the connection request.';
      } else if (error.message?.includes('not installed')) {
        errorMsg = 'MetaMask is not installed. Please install MetaMask to continue.';
      } else {
        errorMsg = error.message || 'Failed to connect wallet';
      }
      
      setWalletError(errorMsg);
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

          {walletError && (
            <div style={{ 
              color: '#ff4444', 
              background: '#fff0f0', 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {walletError}
            </div>
          )}

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
