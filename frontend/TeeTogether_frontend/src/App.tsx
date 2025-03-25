import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/home/Home";
import Friends from "./pages/Friends/Friends";
import RegisterRound from "./pages/RegisterRound/RegisterRound";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header/Header";
import Nav from "./components/Nav/Nav";

function App() {
  const authContext = useContext(AuthContext);

  const userId = authContext?.userId || null;

  return (
    <Router>
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friends" element={userId ? <Friends /> : <Navigate to="/profile" />} />
          <Route path="/register-round" element={userId ? <RegisterRound /> : <Navigate to="/profile" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Nav />
    </Router>
  );
}

export default App;
