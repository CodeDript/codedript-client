# CodeDript Client

Frontend application for the CodeDript platform. Built with React and TypeScript, this application provides the user interface for managing agreements, browsing gigs, and interacting with blockchain smart contracts.

## Features

- MetaMask wallet authentication
- Gig marketplace browsing
- Agreement creation and management
- Milestone tracking
- IPFS document viewing
- Real-time transaction monitoring
- Responsive design

## Project Structure

```
src/
├── api/                 # API integration layer
├── components/          # Reusable UI components
├── pages/              # Application pages
├── context/            # React Context providers
├── services/           # Business logic
├── types/              # TypeScript types
├── utils/              # Helper functions
└── assets/             # Images and static files
```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` file:

   ```bash
   cp .env.example .env
   ```

3. Configure environment variables:

   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_CONTRACT_ADDRESS=your_contract_address
   VITE_BLOCKCHAIN_NETWORK=sepolia
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Build output will be in the `dist/` directory.

## Technology Stack

- React 18
- TypeScript
- Vite
- React Query
- ethers.js
- React Router

## Key Components

- **Authentication**: MetaMask wallet login
- **Gig Marketplace**: Browse and filter gigs
- **Agreement Flow**: Multi-step contract creation
- **Dashboard**: Project and milestone tracking
- **Notifications**: Real-time updates

## Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## Environment Variables

```
VITE_API_URL              # Backend API URL
VITE_CONTRACT_ADDRESS     # Smart contract address
VITE_BLOCKCHAIN_NETWORK   # Network name (sepolia/mainnet)
VITE_CHAIN_ID            # Chain ID
```

## License

MIT
