import { Link } from "react-router-dom";
import "./nav.css";

const Nav = () => {
  return (
    <nav className="bottom-nav">
      <Link to="/"><span className="icon">🏠</span></Link>
      <Link to="/friends"><span className="icon">👥</span></Link>
      <Link to="/register-round"><span className="icon">✍️</span></Link>
      <Link to="/profile"><span className="icon">👤</span></Link>
    </nav>
  );
};

export default Nav;
