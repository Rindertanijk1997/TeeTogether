import { NavLink } from "react-router-dom";
import { FaHome, FaUserFriends, FaEdit, FaUser } from "react-icons/fa";
import "./nav.css";

const Nav = () => {
  return (
    <nav className="nav-container">
      <NavLink to="/dashboard" className="nav-item">
        <FaHome />
        <span>Hem</span>
      </NavLink>
      <NavLink to="/friends" className="nav-item">
        <FaUserFriends />
        <span>Vänner</span>
      </NavLink>
      <NavLink to="/register-round" className="nav-item">
        <FaEdit />
        <span>Registrera</span>
      </NavLink>
      <NavLink to="/profile" className="nav-item">
        <FaUser />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
};

export default Nav;
