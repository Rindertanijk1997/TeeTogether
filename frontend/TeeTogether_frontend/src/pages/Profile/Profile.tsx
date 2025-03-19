import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // Se till att importen stämmer
import "./profile.css"; 

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

const Profile = () => {
  const { login, logout, userId } = useContext(AuthContext)!; // Hämtar login/logout från context
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Hantera inloggning
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
        login(data.token, data.userId); // ✅ Sparar token + userId i AuthContext
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
  
    try {
      const response = await fetch(`${BACKEND_URL}/users/register`, { // ✅ RÄTT URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, city, age: Number(age) }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("✅ Registrering lyckades!", data);
        login(data.token, data.userId); // ✅ Sparar användaren i AuthContext
      } else {
        setError(data.error || "Något gick fel vid registrering.");
      }
    } catch (error) {
      setError("Nätverksfel. Kontrollera din internetanslutning.");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="profile-container">
      {userId ? (
        <div>
          <h2>Välkommen!</h2>
          <button onClick={logout}>Logga ut</button>
        </div>
      ) : (
        <div>
          <h2>{isRegistering ? "Skapa konto" : "Logga in"}</h2>
          <form onSubmit={isRegistering ? handleRegister : handleLogin}>
            <label>
              Användarnamn:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>

            <label>
              Lösenord:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {isRegistering && (
              <>
                <label>
                  Stad:
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Ålder:
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                  />
                </label>
              </>
            )}

            {error && <p className="error">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Laddar..." : isRegistering ? "Registrera dig" : "Logga in"}
            </button>
          </form>

          <p>
            {isRegistering ? "Har du redan ett konto?" : "Har du inget konto?"}{" "}
            <button onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? "Logga in här" : "Registrera dig här"}
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
