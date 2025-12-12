import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authStyles from './AuthForm.module.css';
import Button3B from '../button/Button3Black1/Button3Black1';
import { showAlert } from './Alert';

interface MetaMaskLoginProps {
  onLoginSuccess?: () => void;
  onClose?: () => void;
}

const MetaMaskLogin: React.FC<MetaMaskLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const navigate = useNavigate();

  // Connect wallet and login
  const handleConnect = async () => {
    setIsConnecting(true);

    try {
      // Mock login - store user in localStorage
      const mockUser = {
        _id: 'user-001',
        email: 'user@example.com',
        role: 'client',
        profile: { name: 'Mock User' },
        walletAddress: '0x1234567890abcdef'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      showAlert('Login successful!', 'success');
      
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess();
      }

      // Close modal after short delay
      setTimeout(() => {
        if (onClose) {
          onClose();
        }

        // Route based on user role
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const role = userData.role || 'client';
          
          // Route to appropriate dashboard
          if (role === 'developer') {
            navigate('/developer');
          } else if (role === 'client') {
            navigate('/client');
          } else {
            // Default to client dashboard
            navigate('/client');
          }
        }
      }, 1500);
    } catch (err: any) {
      console.error('Login error:', err);
      showAlert(err.message || 'Failed to connect wallet', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Show error from context if any
  // Don't automatically show context error on every render here to avoid duplicate alerts.
  // Errors are handled in the connect flow's catch block below.

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

