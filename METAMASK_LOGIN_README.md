# MetaMask Login Component

A complete React + TypeScript component for MetaMask wallet authentication with signature-based login.

## Features

✅ Connect to MetaMask wallet  
✅ Request wallet accounts (`eth_requestAccounts`)  
✅ Display connected wallet address  
✅ Sign login message with timestamp  
✅ Send signature to backend for verification  
✅ Loading states (connecting, signing)  
✅ Error handling (user rejection, no MetaMask, etc.)  
✅ Clean TypeScript types  
✅ Inline CSS styling  

---

## Installation

### 1. Install ethers.js v6

```bash
npm install ethers@6
```

or

```bash
yarn add ethers@6
```

### 2. Add the Component

Copy `MetaMaskLogin.tsx` to your project:

```
src/
  components/
    auth/
      MetaMaskLogin.tsx
```

---

## Usage

### Basic Example

```tsx
import MetaMaskLogin from './components/auth/MetaMaskLogin';

function App() {
  const handleLoginSuccess = (walletAddress: string, signature: string) => {
    console.log('Logged in with wallet:', walletAddress);
    console.log('Signature:', signature);
    
    // Store auth token or session
    localStorage.setItem('wallet_address', walletAddress);
  };

  return (
    <div>
      <h1>My App</h1>
      <MetaMaskLogin onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}

export default App;
```

### With Existing Auth Flow

You can integrate `MetaMaskLogin` into your existing authentication system:

```tsx
import { useState } from 'react';
import MetaMaskLogin from './components/auth/MetaMaskLogin';
import AuthForm from './components/auth/AuthForm'; // Your existing auth

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMetaMask, setShowMetaMask] = useState(false);

  const handleMetaMaskLogin = (wallet: string, signature: string) => {
    // Call your API to verify and get session token
    fetch('/api/auth/metamask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, signature })
    })
    .then(res => res.json())
    .then(data => {
      setIsLoggedIn(true);
      localStorage.setItem('token', data.token);
    });
  };

  return (
    <div>
      {!isLoggedIn && (
        <>
          <AuthForm /> {/* Email/password login */}
          <button onClick={() => setShowMetaMask(true)}>
            Or Login with MetaMask
          </button>
          {showMetaMask && (
            <MetaMaskLogin onLoginSuccess={handleMetaMaskLogin} />
          )}
        </>
      )}
    </div>
  );
}
```

---

## Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onLoginSuccess` | `(walletAddress: string, signature: string) => void` | No | Callback fired when login succeeds |

---

## Backend API

The component sends a POST request to `/api/verify-login` with:

```json
{
  "walletAddress": "0x1234...",
  "message": "Login to MyWebsite at 2025-01-20T10:30:00.000Z",
  "signature": "0xabcd..."
}
```

### Example Backend (Node.js + Express)

```javascript
const express = require('express');
const { ethers } = require('ethers');

const app = express();
app.use(express.json());

app.post('/api/verify-login', async (req, res) => {
  try {
    const { walletAddress, message, signature } = req.body;

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === walletAddress.toLowerCase()) {
      // Signature is valid - create session/token
      const token = generateAuthToken(walletAddress); // Your token logic
      
      res.json({
        success: true,
        token,
        wallet: walletAddress
      });
    } else {
      res.status(401).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification failed' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
```

---

## How It Works

### 1. **Connect MetaMask**
- Checks if MetaMask is installed (`window.ethereum`)
- Requests accounts using `eth_requestAccounts`
- Displays connected wallet address

### 2. **Sign Message**
- Creates timestamped message: `"Login to MyWebsite at [ISO timestamp]"`
- Uses `signer.signMessage()` from ethers.js v6
- User approves signature in MetaMask popup

### 3. **Verify on Backend**
- Sends `{ walletAddress, message, signature }` to backend
- Backend recovers signer address from signature
- Compares recovered address with claimed wallet address
- Returns auth token if valid

---

## Error Handling

The component handles:

- ❌ MetaMask not installed → Shows install prompt
- ❌ User rejects connection → Shows error message
- ❌ User rejects signature → Shows "Signature request was rejected"
- ❌ Backend verification fails → Shows backend error message
- ❌ Network issues → Shows connection error

---

## Styling

The component uses inline styles for portability. You can:

### Option 1: Override with CSS Modules
```tsx
import styles from './MetaMaskLogin.module.css';
// Remove inline styles and use className={styles.container}
```

### Option 2: Use Styled Components
```tsx
import styled from 'styled-components';

const Container = styled.div`
  max-width: 500px;
  margin: 2rem auto;
  /* ... */
`;
```

### Option 3: Use Tailwind CSS
```tsx
<div className="max-w-lg mx-auto p-6 border rounded-lg">
  {/* ... */}
</div>
```

---

## TypeScript Support

Fully typed with TypeScript:

```typescript
interface MetaMaskLoginProps {
  onLoginSuccess?: (walletAddress: string, signature: string) => void;
}
```

No additional type definitions needed - ethers v6 includes full TypeScript support.

---

## Testing

### Test Locally

1. Install MetaMask browser extension
2. Create a test wallet (use testnet)
3. Run your React app: `npm run dev`
4. Click "Connect MetaMask"
5. Approve connection
6. Click "Login with Signature"
7. Sign the message

### Mock Backend for Testing

```javascript
// server.js - simple mock backend
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/verify-login', (req, res) => {
  console.log('Received:', req.body);
  res.json({ success: true, message: 'Login verified!' });
});

app.listen(3001);
```

Run with: `node server.js`

Update your Vite config to proxy API requests:

```javascript
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  }
}
```

---

## Security Best Practices

### ✅ DO

- Always verify signatures on the backend
- Use HTTPS in production
- Add nonce/timestamp to prevent replay attacks
- Expire signatures after a short time (5-10 minutes)
- Store session tokens securely (httpOnly cookies)

### ❌ DON'T

- Don't trust wallet addresses without signature verification
- Don't use signatures as permanent tokens
- Don't expose private keys or mnemonics
- Don't skip backend verification

---

## Troubleshooting

### "MetaMask is not installed"
- Install MetaMask extension: https://metamask.io/download/

### "User rejected the request"
- User clicked "Cancel" in MetaMask popup
- Try again and click "Approve"

### "Failed to fetch" / Network Error
- Check if backend is running
- Verify API endpoint URL
- Check CORS settings on backend

### TypeScript Errors with `window.ethereum`
Add to your `vite-env.d.ts` or `global.d.ts`:

```typescript
interface Window {
  ethereum?: any;
}
```

---

## Dependencies

- **ethers.js v6**: Ethereum library for wallet interaction
- **React 18+**: UI framework
- **TypeScript**: Type safety

---

## License

MIT - feel free to use in your projects!

---

## Support

For issues or questions:
- Check MetaMask docs: https://docs.metamask.io/
- Check ethers.js docs: https://docs.ethers.org/v6/
- Create an issue in your project repo

---

**Built with ❤️ for the Web3 community**
