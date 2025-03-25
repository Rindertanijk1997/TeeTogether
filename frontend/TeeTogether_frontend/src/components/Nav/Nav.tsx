import { Link } from "react-router-dom";
import "./nav.css";
import homeIcon from "../../assets/homeIcon.svg";
import friendsIcon from "../../assets/friendsIcon.svg";
import registerIcon from "../../assets/registerIcon.svg";
import profileIcon from "../../assets/profilIcon.svg";

const Nav = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/">
        <img src={homeIcon} alt="Hem" className="nav-icon" />
      </Link>
      <Link to="/friends">
        <img src={friendsIcon} alt="Vänner" className="nav-icon" />
      </Link>
      <Link to="/register-round">
        <img src={registerIcon} alt="Registrera rond" className="nav-icon" />
      </Link>
      <Link to="/profile">
        <img src={profileIcon} alt="Profil" className="nav-icon" />
      </Link>
    </nav>
  );
};

export default Nav;
