import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home.tsx';
import ComingSoon from './pages/ComingSoon/ComingSoon.tsx';
import './App.css';
import Alert from './components/auth/Alert';
import NavBar from './components/navbar/Navbar';
import AuthForm from './components/auth/AuthForm';

export default function App() {
   const [accessToken, setAccessToken] = useState<string | null>(
        () => localStorage.getItem('access_token')
    );
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const handleLoginClick = () => setIsAuthOpen(true);

    const handleLoginSuccess = (token: string) => {
        setAccessToken(token);
        localStorage.setItem('access_token', token);
        setIsAuthOpen(false);
    };

    const handleLogout = () => {
        setAccessToken(null);
        localStorage.removeItem('access_token');
    };

  return (
     <Router>
      <NavBar
        isLoggedIn={!!accessToken}
        onLoginClick={handleLoginClick}
        onLogout={handleLogout}
      />
      {isAuthOpen && (
        <AuthForm
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
      <Alert />
    </Router>
  );
}
