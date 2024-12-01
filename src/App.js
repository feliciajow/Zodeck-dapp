import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Cardpack from './pages/Cardpack';
import Marketplace from './pages/Marketplace';

function Header() {
  const location = useLocation();
  console.log(location.pathname);
  const hideHeaderRoutes = ['/', '/cardpack']; // Add routes where you want to hide the header

  if (hideHeaderRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="header">
      <img src="/logo512.png" alt="Zodeck Logo" className="logo" />
      <div className="user-info">
        <span className="user-name">John Doe</span>
        <div className="user-avatar"></div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
      <Header />
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<Login />} />
          {/* Route for Landing Page */}
          <Route path="/landing" element={<Landing />} />
          {/* Route for Cardpack page */}
          <Route path="/cardpack" element={<Cardpack />} />
          {/* Route for Marketplace page */}
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
