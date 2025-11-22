import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/HomePage/Home.tsx';
import AllGigs from './pages/AllGigs/AllGigs.tsx';
import ComingSoon from './pages/ComingSoon/ComingSoon.tsx';
import GigView from './pages/GigView/gigview.tsx';
import Client from './pages/User/client/client.tsx';
import Developer from './pages/User/developer/developer.tsx';
import './App.css';
import Alert from './components/auth/Alert';
import NavBar from './components/navbar/Navbar';
import AuthForm from './components/auth/AuthForm';

function AppContent() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginClick = () => setIsAuthOpen(true);

  const handleLogout = () => {
    logout();
    setIsAuthOpen(false);
  };

  return (
    <Router>
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
          <Route path="/" element={<Home />} />
           <Route path="/all-gigs" element={<AllGigs />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/client" element={<Client />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/gigview" element={<GigView />} />
        </Routes>
      </div>
      <Alert />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
