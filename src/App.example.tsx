import { useState } from 'react';
import MetaMaskLogin from './components/auth/MetaMaskLogin';
import './App.css';

/**
 * Example App.tsx demonstrating MetaMaskLogin usage
 * 
 * This is a standalone example. In your actual app, you can integrate
 * MetaMaskLogin into your existing authentication flow.
 */
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userWallet, setUserWallet] = useState<string>('');

  const handleLoginSuccess = (walletAddress: string, signature: string) => {
    console.log('Login successful!');
    console.log('Wallet:', walletAddress);
    console.log('Signature:', signature);
    
    // Set logged in state
    setIsLoggedIn(true);
    setUserWallet(walletAddress);

    // You can store token/session in localStorage or state management
    // localStorage.setItem('auth_token', signature);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserWallet('');
    // localStorage.removeItem('auth_token');
  };

  return (
    <div className="App">
      <header style={styles.header}>
        <h1>MetaMask Login Example</h1>
        {isLoggedIn && (
          <div style={styles.userInfo}>
            <p>Logged in as: <strong>{userWallet}</strong></p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main style={styles.main}>
        {!isLoggedIn ? (
          <>
            <p style={styles.intro}>
              Connect your MetaMask wallet and sign a message to login securely.
            </p>
            <MetaMaskLogin onLoginSuccess={() => handleLoginSuccess('', '')} />
          </>
        ) : (
          <div style={styles.dashboard}>
            <h2>Welcome! 🎉</h2>
            <p>You are now logged in with wallet: {userWallet}</p>
            <p>This is your protected content area.</p>
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>Built with React + TypeScript + ethers.js v6</p>
      </footer>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    padding: '2rem',
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
  },
  userInfo: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
  },
  logoutButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  main: {
    minHeight: '60vh',
    padding: '2rem',
  },
  intro: {
    textAlign: 'center',
    fontSize: '1.1rem',
    color: '#555',
    marginBottom: '2rem',
  },
  dashboard: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor: '#f0f0f0',
    borderRadius: '12px',
    textAlign: 'center',
  },
  footer: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
    color: '#6c757d',
    fontSize: '0.875rem',
  },
};

export default App;
