import "./home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="homeHero">
        <img src="src/assets/home.hero.svg" alt="Golf Hero" className="hero-image" />
        <div className="hero-text">
          <h1>Hitta en spelpartner med oss</h1>
        </div>
      </div>

      {/* Om TeeTogether */}
      <div className="home-info">
        <p>
          <strong>TeeTogether</strong> är en plattform skapad för att föra samman golfare på alla nivåer, oavsett ålder eller erfarenhet. 
          Vi erbjuder ett användarvänligt verktyg där golfare kan logga sina rundor och hitta nya golfvänner att spela med.
        </p>
        <p>
          Vår vision är att göra golfupplevelsen ännu mer givande genom att skapa en engagerande gemenskap där spelare kan dela framgångar,
          utmana varandra och bygga långvariga vänskaper både på och utanför golfbanan.
        </p>
        <p>
          <strong>TeeTogether</strong> är den perfekta digitala kompanjonen för den moderna golfaren, byggd med fokus på innovation och social interaktion.
        </p>

        <Link to="/profile">
        <button className="cta-button">Gå med idag</button>
      </Link>
      </div>
    </div>
  );
};

export default Home;
