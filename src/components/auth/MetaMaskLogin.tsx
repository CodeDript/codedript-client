import { useState } from 'react';
import authStyles from './AuthForm.module.css';
import Button3B from '../button/Button3Black1/Button3Black1';
import { showAlert } from './Alert';
import { connectWallet } from '../../services/ContractService';
import { useWalletLogin } from '../../query/useAuth';
import { useAuthContext } from '../../context/AuthContext';

interface MetaMaskLoginProps {
  onLoginSuccess?: () => void;
  onClose?: () => void;
}

const MetaMaskLogin: React.FC<MetaMaskLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  const walletLoginMutation = useWalletLogin();
  const { setUser, setToken } = useAuthContext();

  // Connect wallet and login
  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Connect to MetaMask and get wallet address
      const account = await connectWallet();
      const walletAddress = account.address.toLowerCase();

      // Call wallet login API
      const response = await walletLoginMutation.mutateAsync({ walletAddress });
      
      // Extract data from response
      const token = response?.token || response?.data?.token;
      const user = response?.user || response?.data?.user;

      // Update auth context
      if (token) {
        setToken(token);
      }
      if (user) {
        setUser(user);
      }
      
      showAlert('Login successful!', 'success');
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Close modal after short delay — do not navigate anywhere
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 500);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to connect wallet';
      showAlert(errorMessage, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className={authStyles.metaMaskContainer}>
      <Button3B
        text={isConnecting ? 'Connecting...' : 'Connect'}
        onClick={handleConnect}
        className={isConnecting ? authStyles.metaMaskButtonDisabled : ''}
      />
    </div>
  );
};

export default MetaMaskLogin;

