import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/HomePage/Home.tsx';
import AllGigs from './pages/AllGigs/AllGigs.tsx';
import ComingSoon from './pages/ComingSoon/ComingSoon.tsx';
import BlockchainSecurity from './components/cardDetails/BlockchainSecurity';
import IPFSFileStorage from './components/cardDetails/IPFSFileStorage';
import EscrowProtection from './components/cardDetails/EscrowProtection';
import MultiPartyContracts from './components/cardDetails/MultiPartyContracts';
import ZeroKnowledgeVerification from './components/cardDetails/ZeroKnowledgeVerification';
import InstantPayments from './components/cardDetails/InstantPayments';
import NotFound from './pages/NotFound/NotFound';
import GigView from './pages/GigView/gigview.tsx';
// ContractProcessing was moved into components/ContractPages — update import path
import ContractProcessing from './components/ContractPages/contractprocessing.tsx';
import PageCotractD from './pages/createContract/pageCotractD/pageCotractD.tsx';
import ContractView from './pages/createContract/pageCotractD/contractView/contractView';
import CreateGigPage from './pages/createContract/pageCotractD/createGigPage/CreateGigPage';
import RequestChange from './pages/createContract/pageCotractD/contractView/RequestChange';
import RulesAndConditions from './pages/createContract/pageCotractD/contractView/RulesAndConditions';
import Client from './pages/User/client/client.tsx';
import Developer from './pages/User/developer/developer.tsx';
import './App.css';
import Alert from './components/auth/Alert';
import NavBar from './components/navbar/Navbar';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import AuthForm from './components/auth/AuthForm';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginClick = () => setIsAuthOpen(true);

  const handleLogout = () => {
    logout();
    setIsAuthOpen(false);
    navigate('/');
  };

  return (
    <>
      <NavBar
        isLoggedIn={isAuthenticated}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        userRole={user?.role || 'developer'}
      />
      {isAuthOpen && (
        <AuthForm onClose={() => setIsAuthOpen(false)} />
      )}
      {/* Auto scroll to top on route changes */}
      <ScrollToTop />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/all-gigs" element={<AllGigs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/features/blockchain-security" element={<BlockchainSecurity />} />
          <Route path="/features/ipfs-storage" element={<IPFSFileStorage />} />
          <Route path="/features/escrow-protection" element={<EscrowProtection />} />
          <Route path="/features/multi-party-contracts" element={<MultiPartyContracts />} />
          <Route path="/features/zero-knowledge" element={<ZeroKnowledgeVerification />} />
          <Route path="/features/instant-payments" element={<InstantPayments />} />
          <Route path="/client" element={<Client />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/gigview/:id" element={<GigView />} />
          <Route path="/contract-processing" element={<ContractProcessing />} />
          <Route path="/create-contract" element={<PageCotractD />} />
          <Route path="/create-gig" element={<CreateGigPage />} />
          <Route path="/create-contract/rules" element={<ContractView />} />
          <Route path="/create-contract/request-change" element={<RequestChange />} />
          <Route path="/create-contract/terms" element={<RulesAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Alert />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
