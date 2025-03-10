import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Friends from "./pages/Friends/Friends";
import RegisterRound from "./pages/RegisterRound/RegisterRound";
import Profile from "./pages/Profile/Profile";
import Nav from "./components/Nav/Nav";
import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header visas på alla sidor */}
        <Header /> 

        <div className="content">
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/register-round" element={<RegisterRound />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Navigationsfältet visas på alla sidor utom login/register */}
        <Nav />
      </div>
    </Router>
  );
}

export default App;

