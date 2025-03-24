import { useEffect, useState } from "react";
import { motion } from "framer-motion"; // ✅ Importera Framer Motion
import "./registerRound.css";

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

interface Round {
  Course: string;
  Score: number;
  NewHCP: number;
  Date: string;
}

const RegisterRound = () => {
  const [course, setCourse] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentHCP, setCurrentHCP] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const storedHCP = localStorage.getItem(`hcp-${userId}`);
      if (storedHCP) setCurrentHCP(Number(storedHCP));
  
      const storedRounds = localStorage.getItem(`rounds-${userId}`);
      if (storedRounds) setRounds(JSON.parse(storedRounds)); // ✅ Visa direkt
  
      fetchUserData();    // Hämtar aktuell HCP
      fetchRounds(true);  // Hämtar nya rundor, men visar inte laddningssnurran
    }
  }, [userId]);
  

  const fetchUserData = async () => {
    try {
      console.log(`🔵 Hämtar användardata för userId: ${userId}`);
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Kunde inte hämta användardata.");

      const data = await response.json();
      console.log("🟢 Fullständigt API-svar:", JSON.stringify(data, null, 2));

      const userData = data.find((user: any) => user.UserId === userId);
      if (userData) {
        console.log("🟢 Hittad användardata:", userData);
        if (userData.CurrentHCP !== undefined) {
          setCurrentHCP(userData.CurrentHCP);
          localStorage.setItem(`hcp-${userId}`, userData.CurrentHCP.toString());
        }
      } else {
        console.error("❌ Kunde inte hitta användaren i API-svaret!");
      }
    } catch (error) {
      console.error("❌ Fel vid hämtning av användardata:", error);
    }
  };

  const fetchRounds = async (silent = false) => {
    try {
      if (!silent) setLoading(true); // Visa laddning bara om det inte är "silent"
  
      const response = await fetch(`${BACKEND_URL}/rounds?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Kunde inte hämta ronder.");
  
      const data = await response.json();
      const latestRounds = data.slice(-5);
  
      setRounds(latestRounds);
      localStorage.setItem(`rounds-${userId}`, JSON.stringify(latestRounds)); // ✅ Uppdatera lagrat
    } catch (error) {
      console.error("❌ Fel vid hämtning av ronder:", error);
    } finally {
      if (!silent) setLoading(false); // Avsluta laddning
    }
  };
  

  const submitRound = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("📌 Debug: Kollar fält innan submission:");
    console.log("Golfbana:", course);
    console.log("Poäng:", score);
    console.log("Nuvarande HCP:", currentHCP);

    if (!course || score === "" || currentHCP === null) {
      alert("Alla fält måste fyllas i!");
      return;
    }

    const lastRound = rounds.length > 0 ? rounds[rounds.length - 1] : null;
    const newHCP = lastRound ? lastRound.NewHCP : currentHCP;

    try {
      console.log("📌 Skickar rond:", { userId, course, score, newHCP });
      const response = await fetch(`${BACKEND_URL}/registerRound`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, course, score, newHCP }),
      });

      if (!response.ok) throw new Error("Något gick fel vid registrering av ronden.");

      console.log("✅ Rond registrerad!");
      setCourse("");
      setScore("");
      fetchRounds();
    } catch (error) {
      console.error("❌ Fel vid registrering av rond:", error);
    }
  };

  return (
    <motion.div
      className="register-round-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="register-title">Registrera Golf-Rond</h2>

      <motion.form onSubmit={submitRound} className="register-form" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
        <input
          type="text"
          placeholder="⛳ Golfbana"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="number"
          placeholder="🏌️‍♂️ Antal poäng"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          required
          className="input-field"
        />
        <button type="submit" className="register-button">Registrera Rond</button>
      </motion.form>

      <h3 className="rounds-title">Senaste Ronder</h3>

      {loading ? (
        <p className="loading-text">⏳ Laddar...</p>
      ) : rounds.length > 0 ? (
        <motion.ul className="rounds-list">
          {rounds.map((round, index) => (
            <motion.li
              key={`round-${index}`}
              className="round-item"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="round-info">
                <p className="round-date">{new Date(round.Date).toLocaleDateString()}</p>
                <p className="round-course">⛳ <strong>{round.Course}</strong></p>
              </div>
              <div className="round-stats">
                <p className="round-score"> {round.Score} Poäng</p>
                <p className="round-hcp">Nytt HCP: {round.NewHCP}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      ) : (
        <p className="no-rounds-text">Inga registrerade ronder ännu.</p>
      )}
    </motion.div>
  );
};

export default RegisterRound;
