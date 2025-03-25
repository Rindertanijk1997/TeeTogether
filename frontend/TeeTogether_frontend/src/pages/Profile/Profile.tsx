import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import "./profile.css"; 

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

const Profile = () => {
  const { login, logout, userId } = useContext(AuthContext)!;
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [initialHCP, setInitialHCP] = useState<number | "">(""); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Inloggning lyckades!", data);
        login(data.token, data.userId);
      } else {
        setError(data.error || "Felaktiga inloggningsuppgifter.");
      }
    } catch (error) {
      setError("Nätverksfel. Kontrollera din internetanslutning.");
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (initialHCP === "" || age === "") {
      setError("Alla fält måste fyllas i!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/users/register`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          city,
          age: Number(age),
          initialHCP: Number(initialHCP),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Registrering lyckades!", data);
        login(data.token, data.userId);
      } else {
        setError(data.error || "Något gick fel vid registrering.");
      }
    } catch (error) {
      setError("Nätverksfel. Kontrollera din internetanslutning.");
    }

    setLoading(false);
  };

  return (
    <motion.div 
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="profile-container">
        {userId ? (
          <motion.div 
            className="profile-logged-in"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Välkommen!</h2>
            <button className="logout-button" onClick={logout}>Logga ut</button>
          </motion.div>
        ) : (
          <motion.div 
            className="profile-form-container"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="profile-title">{isRegistering ? "Skapa konto" : "Logga in"}</h2>
            <form onSubmit={isRegistering ? handleRegister : handleLogin} className="profile-form">
              <input
                type="text"
                placeholder="Användarnamn"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
              <input
                type="password"
                placeholder="Lösenord"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
              {isRegistering && (
                <>
                  <input
                    type="text"
                    placeholder="Stad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Ålder"
                    value={age}
                    onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Handicap (HCP)"
                    step="0.1"
                    value={initialHCP}
                    onChange={(e) => setInitialHCP(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="input-field"
                  />
                </>
              )}
              {error && <p className="error-text">{error}</p>}
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "⏳ Laddar..." : isRegistering ? "Registrera dig" : "Logga in"}
              </button>
            </form>
            <p className="toggle-text">
              {isRegistering ? "Har du redan ett konto?" : "Har du inget konto?"}{" "}
              <button className="toggle-button" onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Logga in här" : "Registrera dig här"}
              </button>
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
