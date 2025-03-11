import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Friends from './pages/Friends/Friends';
import RegisterRound from './pages/RegisterRound/RegisterRound';
import Profile from './pages/Profile/Profile';
import Header from './components/Header/Header';
import Nav from './components/Nav/Nav';
import { useState, useEffect } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friends" element={isAuthenticated ? <Friends /> : <Navigate to="/profile" />} />
          <Route path="/register-round" element={isAuthenticated ? <RegisterRound /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={<Profile setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
      <Nav />
    </Router>
  );
}

export default App;
