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
  const [currentHCP, setCurrentHCP] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const storedHCP = localStorage.getItem(`hcp-${userId}`);
      if (storedHCP) {
        setCurrentHCP(Number(storedHCP)); // Ladda användarens HCP från localStorage
      }

      const storedRounds = localStorage.getItem(`rounds-${userId}`);
      if (storedRounds) {
        setRounds(JSON.parse(storedRounds)); // Ladda sparade ronder direkt
      }
      fetchUserData(); // Hämta uppdaterad användardata inklusive HCP
      fetchRounds(); // Hämta uppdaterade rundor
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
      console.log("🟢 Fullständigt API-svar för användardata:", JSON.stringify(data, null, 2));
  
      // ✅ Hitta användaren baserat på userId
      const userData = data.find((user: any) => user.UserId === userId);
  
      if (userData) {
        console.log("🟢 Hittad användardata:", userData);
  
        if (userData.CurrentHCP !== undefined) {
          console.log("✅ Hittade CurrentHCP:", userData.CurrentHCP);
          setCurrentHCP(userData.CurrentHCP);
          localStorage.setItem(`hcp-${userId}`, userData.CurrentHCP.toString());
        } else {
          console.warn("⚠️ Ingen CurrentHCP hittades i användardatan, men användaren finns!");
        }
      } else {
        console.error("❌ Kunde inte hitta användaren i API-svaret!");
      }
  
    } catch (error) {
      console.error("❌ Fel vid hämtning av användardata:", error);
    }
  };
  

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
      localStorage.setItem(`rounds-${userId}`, JSON.stringify(latestRounds));
    } catch (error) {
      console.error("❌ Fel vid hämtning av ronder:", error);
    } finally {
      setLoading(false);
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
