import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home.tsx';
import ComingSoon from './pages/ComingSoon/ComingSoon.tsx';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
        </Routes>
      </div>
    </Router>
  );
}
