# Code Dript - Blockchain Web Application

A modern, blockchain-powered web application built with React, TypeScript, and CSS Modules.

## 📁 Project Structure

```
src/
├── assets/          → Images, icons, and fonts
├── components/      → Reusable UI components
│   ├── hero/       → Hero section components
│   ├── CardOne.tsx
│   ├── CardTwo.tsx
│   └── CardThree.tsx
├── constants/       → Fixed values and configuration
├── context/         → React Context Providers
├── hooks/           → Custom React hooks (useWallet, etc.)
├── pages/           → Full-page route components
├── services/        → Blockchain integration logic
├── styles/          → Global CSS and theme variables
├── types/           → TypeScript type definitions
├── utils/           → Helper functions
├── App.tsx          → Main app component
└── main.tsx         → Application entry point
```

## 🚀 Features

- ✅ Three modern hero sections with gradient backgrounds
- ✅ Three reusable card components with hover animations
- ✅ Zoom control (75%-125% limit)
- ✅ Blockchain wallet integration placeholder (MetaMask support)
- ✅ TypeScript for type safety
- ✅ CSS Modules for scoped styling
- ✅ Responsive design
- ✅ Modern React best practices

## 🎨 Components

### Hero Sections
- **HeroMain**: Full viewport height (100vh) main hero
- **HeroSecondary**: 500px height secondary hero
- **HeroTertiary**: 500px height tertiary hero

### Cards
- **CardOne**: Secure Transactions card
- **CardTwo**: Decentralized Network card
- **CardThree**: Smart Contracts card

## 🛠️ Tech Stack

- React 18
- TypeScript
- Vite
- CSS Modules
- Ethers.js (ready for integration)

## 📦 Installation

```bash
npm install
```

## 🏃‍♂️ Development

```bash
npm run dev
```

## 🏗️ Build

```bash
npm run build
```

## 🔐 Blockchain Integration

The application includes placeholder services for blockchain integration:
- Wallet connection (MetaMask)
- Transaction handling
- Balance checking
- Network detection

To integrate with a real blockchain:
1. Install ethers.js: `npm install ethers`
2. Update `src/services/blockchain.ts` with your RPC endpoints
3. Configure networks in `src/constants/index.ts`

## 🎯 Zoom Control

The application enforces zoom limits between 75% and 125%:
- Viewport meta tag configuration
- JavaScript-based zoom prevention
- Keyboard shortcut blocking (Ctrl/Cmd + +/-)
- Mouse wheel zoom prevention

## 📱 Responsive Design

All components are fully responsive with breakpoints at:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🧩 Custom Hooks

- **useWallet**: Manage wallet connection state and MetaMask integration

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
