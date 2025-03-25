import "./header.css";
import headerImage from "../../assets/Header.svg"; 

const Header = () => (
  <header className="header">
    <img src={headerImage} alt="TeeTogether Header" className="header-img" />
  </header>
);

export default Header;

