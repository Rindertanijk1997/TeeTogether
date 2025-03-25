import "./home.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
    className="home-container"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <motion.div 
      className="home-hero"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img src="src/assets/home.hero.svg" alt="Golf Hero" className="hero-image" />
      <motion.div 
        className="hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1>Lyft din golfupplevelse till nästa nivå</h1>
        <p>Hitta spelpartners, logga rundor och bli en del av den exklusiva golfgemenskapen.</p>
        <Link to="/profile">
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Gå med idag
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>

    <motion.div 
      className="home-info"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <h2>Välkommen till TeeTogether</h2>
      <p>
      TeeTogether är en plattform skapad för att föra samman golfare på alla nivåer, oavsett ålder eller erfarenhet.
       Vi erbjuder ett användarvänligt verktyg där golfare kan logga sina rundor och hitta nya golfvänner att spela med.
      Vår vision är att göra golfupplevelsen ännu mer givande genom att skapa en engagerande gemenskap där spelare kan dela framgångar,
       utmana varandra och bygga långvariga vänskaper både på och utanför golfbanan. TeeTogether är den perfekta digitala kompanjonen för den moderna golfaren,
      byggd med fokus på innovation och social interaktion.
      </p>
      
    </motion.div>
  </motion.div>
  );
};

export default Home;
