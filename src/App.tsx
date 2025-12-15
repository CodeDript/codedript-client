import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { navigation, ProtectedRoute } from './utils';
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
import Settings from './pages/Settings/Settings.tsx';
import './App.css';
import Alert from './components/auth/Alert';
import NavBar from './components/navbar/Navbar';
import AuthForm from './components/auth/AuthForm';
import { useAuthContext } from './context/AuthContext';
import { TempDataProvider } from './context/TempDataContext';

function AppContent() {
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user, setUser, setToken, isAuthenticated } = useAuthContext();
  
  // Initialize navigation service
  useEffect(() => {
    navigation.setNavigate(navigate);
  }, [navigate]);

  const handleLoginClick = () => setIsAuthOpen(true);

  const handleLogout = () => {
    // Clear auth context
    setUser(null);
    setToken(null);
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('walletAddress');
    setIsAuthOpen(false);
    navigate('/');
  };

  return (
    <TempDataProvider>
      <NavBar
        isLoggedIn={isAuthenticated}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
        userRole={user?.role || 'developer'}
      />
      {isAuthOpen && (
        <AuthForm onClose={() => setIsAuthOpen(false)} />
      )}
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/all-gigs" element={<AllGigs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/gigview/:id" element={<GigView />} />
          
          {/* Role-Based Protected Routes */}
          <Route path="/client" element={
            <ProtectedRoute allowedRoles={['client']}>
              <Client />
            </ProtectedRoute>
          } />
          <Route path="/developer" element={
            <ProtectedRoute allowedRoles={['developer']}>
              <Developer />
            </ProtectedRoute>
          } />
          <Route path="/create-contract" element={
            <ProtectedRoute allowedRoles={['client']}>
              <PageCotractD />
            </ProtectedRoute>
          } />
          <Route path="/create-gig" element={
            <ProtectedRoute allowedRoles={['developer']}>
              <CreateGigPage />
            </ProtectedRoute>
          } />
          
          {/* Auth-Only Protected Routes */}
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/contract-processing" element={
            <ProtectedRoute>
              <ContractProcessing />
            </ProtectedRoute>
          } />
          <Route path="/create-contract/rules" element={
            <ProtectedRoute>
              <ContractView />
            </ProtectedRoute>
          } />
          <Route path="/create-contract/request-change" element={
            <ProtectedRoute>
              <RequestChange />
            </ProtectedRoute>
          } />
          <Route path="/create-contract/terms" element={
            <ProtectedRoute>
              <RulesAndConditions />
            </ProtectedRoute>
          } />
          
          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Alert />
    </TempDataProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
