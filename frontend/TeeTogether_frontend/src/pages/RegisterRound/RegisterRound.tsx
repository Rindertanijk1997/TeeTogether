import { useEffect, useState } from "react";
import "./registerRound.css";

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

interface Round {
  Course: string;
  Score: number;
  NewHCP: number;
  Date: string;
}

function RegisterRound() {
  const [course, setCourse] = useState("");
  const [score, setScore] = useState<number | "">("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const storedRounds = localStorage.getItem(`rounds-${userId}`);
      if (storedRounds) {
        setRounds(JSON.parse(storedRounds)); // Ladda sparade ronder direkt
      }
      fetchRounds(); // Hämta uppdaterad data i bakgrunden
    }
  }, [userId]);

  // 🔹 Hämta senaste ronder och spara i localStorage
  const fetchRounds = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/rounds?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Kunde inte hämta ronder.");
      const data = await response.json();
      const latestRounds = data.slice(-5); // Visa endast de 5 senaste rundorna

      setRounds(latestRounds);
      localStorage.setItem(`rounds-${userId}`, JSON.stringify(latestRounds)); // ✅ Spara i localStorage
    } catch (error) {
      console.error("❌ Fel vid hämtning av ronder:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Skicka in ronden
  const submitRound = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || score === "") return alert("Alla fält måste fyllas i!");

    try {
      console.log("📌 Skickar rond:", { userId, course, score });
      const response = await fetch(`${BACKEND_URL}/registerRound`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, course, score }),
      });

      if (!response.ok) throw new Error("Något gick fel vid registrering av ronden.");
      
      console.log("✅ Rond registrerad!");
      setCourse("");
      setScore("");
      fetchRounds(); // Hämta uppdaterad lista med senaste rundor (inkl. uppdaterat HCP)
    } catch (error) {
      console.error("❌ Fel vid registrering av rond:", error);
    }
  };

  return (
    <div className="register-round-container">
      <h2>Registrera Golf-Rond</h2>
      <form onSubmit={submitRound}>
        <input
          type="text"
          placeholder="Golfbana"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Antal poäng"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          required
        />
        <button type="submit">Registrera Rond</button>
      </form>

      <h3>Senaste Ronder</h3>
      {loading ? (
        <p>⏳ Laddar...</p>
      ) : rounds.length > 0 ? (
        <ul>
          {rounds.map((round, index) => (
            <li key={`round-${index}`}>
              📅 {new Date(round.Date).toLocaleDateString()} - {round.Course}  
              🏌️‍♂️ {round.Score} poäng - HCP: {round.NewHCP}
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga registrerade ronder ännu.</p>
      )}
    </div>
  );
}

export default RegisterRound;
