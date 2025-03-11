import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <img src="/assets/hero.jpg" alt="Golf Hero" className="hero-image" />
      <div className="home-text">
        <h1>Hitta en spelpartner med oss</h1>
        <p>Delad glädje är dubbel glädje</p>
        <p>
          TeeTogether är en plattform skapad för att föra samman golfare på alla nivåer, oavsett ålder eller erfarenhet.
          Vi erbjuder ett användarvänligt verktyg där golfare kan logga sina rundor och hitta nya golfvänner att spela med.
        </p>
      </div>
    </div>
  );
};

export default Home;
