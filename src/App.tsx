import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/HomePage/Home.tsx';
import AllGigs from './pages/AllGigs/AllGigs.tsx';
import ComingSoon from './pages/ComingSoon/ComingSoon.tsx';
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
import AuthForm from './components/auth/AuthForm';

function AppContent() {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Mock user from localStorage
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = !!user;

  const handleLoginClick = () => setIsAuthOpen(true);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('walletAddress');
    setIsAuthOpen(false);
    navigate('/');
  };

  return (
    <>
      <NavBar
        isLoggedIn={true}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        userRole={'developer'}
      />
      {isAuthOpen && (
        <AuthForm onClose={() => setIsAuthOpen(false)} />
      )}
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
           <Route path="/all-gigs" element={<AllGigs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
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
    <Router>
      <AppContent />
    </Router>
  );
}
