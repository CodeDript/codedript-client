import { useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import authStyles from './AuthForm.module.css';
import Button3B from '../button/Button3Black1/Button3Black1';
import { showAlert } from './Alert';

interface MetaMaskLoginProps {
  onLoginSuccess?: (walletAddress: string, signature: string) => void;
}

const MetaMaskLogin: React.FC<MetaMaskLoginProps> = ({ onLoginSuccess }) => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  // We show all states via toast alerts only

  // Check if MetaMask is installed
  const isMetaMaskInstalled = (): boolean => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      const msg = 'MetaMask is not installed. Please install MetaMask extension.';
      showAlert(msg, 'error');
      return;
    }

    setIsConnecting(true);

    try {
      const { ethereum } = window as any;
      
      // Request wallet accounts
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        console.log('Connected wallet:', accounts[0]);
        showAlert('Wallet connected successfully!', 'success');
      }
    } catch (err: any) {
      console.error('Error connecting to MetaMask:', err);
      showAlert(err.message || 'Failed to connect wallet', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Login with signature
  const loginWithSignature = async () => {
    if (!walletAddress) {
      showAlert('Please connect your wallet first', 'error');
      return;
    }

    setIsSigning(true);

    try {
      const { ethereum } = window as any;
      
      // Create provider and signer using ethers v6
      const provider = new BrowserProvider(ethereum);
      const signer: JsonRpcSigner = await provider.getSigner();

      // Create message with timestamp
      const message = `Login to MyWebsite at ${new Date().toISOString()}`;

      // Sign the message
      const signature = await signer.signMessage(message);

      console.log('Signature:', signature);

      // Send to backend for verification
      const response = await fetch('/api/verify-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          message,
          signature,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        showAlert('Login successful!', 'success');
        console.log('Backend response:', data);
        
        // Call success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(walletAddress, signature);
        }
      } else {
        const errorData = await response.json();
        showAlert(errorData.message || 'Login verification failed', 'error');
      }
    } catch (err: any) {
      console.error('Error signing message:', err);
      
      // Handle user rejection
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        showAlert('Signature request was rejected', 'error');
      } else {
        showAlert(err.message || 'Failed to sign message', 'error');
      }
    } finally {
      setIsSigning(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    showAlert('Wallet disconnected', 'success');
  };

  return (
    <div className={authStyles.metaMaskContainer}>
     

      {!walletAddress && (
        <Button3B
          text={isConnecting ? 'Connecting...' : 'Connect'}
          onClick={connectWallet}
          className={isConnecting ? authStyles.metaMaskButtonDisabled : ''}
        />
      )}

      {/* Wallet connected */}
      {walletAddress && (
        <div className={authStyles.metaMaskWalletInfo}>
          <div className={authStyles.metaMaskAddressContainer}>
            <strong>Connected Wallet:</strong>
            <code className={authStyles.metaMaskAddress}>{walletAddress}</code>
          </div>

          
            <Button3B
              text={isSigning ? 'Signing...' : 'Login with Signature'}
              onClick={loginWithSignature}
              className={isSigning ? authStyles.metaMaskButtonDisabled : ''}
            />

            <Button3B
              text={'Disconnect'}
              onClick={disconnectWallet}
              className={`${authStyles.metaMaskSecondaryButton} ${isSigning ? authStyles.metaMaskButtonDisabled : ''}`}
            />
          </div>
        
      )}

    </div>
  );
};



export default MetaMaskLogin;
