import { useState, useEffect } from "react";
import { registerRound, getUserRounds } from "../../api";
import "./RegisterRound.css";

const RegisterRound = () => {
  const [course, setCourse] = useState("");
  const [score, setScore] = useState<number | "">(""); // Hanterar nummer korrekt
  const [newHCP, setNewHCP] = useState<number | "">(""); // Hanterar nummer korrekt
  const [message, setMessage] = useState("");
  const [rounds, setRounds] = useState<any[]>([]);
  const userId = localStorage.getItem("userId") || ""; // Om det är null, sätt det som tomt


  useEffect(() => {
    fetchRounds();
  }, []);

  const fetchRounds = async () => {
    if (!userId) return;
  
    try {
      const data = await getUserRounds(userId);
      console.log("🎯 Hämtade ronder från API:", data);
  
      // 🔍 Kontrollera om vi fick en lista med användare
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("🚨 API returnerade ingen användardata!");
        setRounds([]);
        return;
      }
  
      // 🔍 Hitta användaren baserat på `userId`
      const user = data.find((u) => u.UserId === userId);
  
      if (!user || !user.LatestRound) {
        console.warn("🚨 Ingen senaste rond hittades för användaren!");
        setRounds([]);
        return;
      }
  
      // 🟢 Hantera flera ronder: Om `LatestRound` är en array, hämta de 5 senaste
      const roundsArray = Array.isArray(user.LatestRound)
        ? user.LatestRound.slice(-5) // Tar de 5 senaste ronderna
        : [user.LatestRound]; // Om bara en rond finns, gör den till en array
  
      console.log("✅ Senaste 5 ronder:", roundsArray);
      setRounds(roundsArray);
    } catch (error) {
      console.error("🚨 Fel vid hämtning av ronder:", error);
    }
  };
  

  const handleRegisterRound = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("UserId:", userId);
    console.log("Golfbana:", course);
    console.log("Score:", score);
    console.log("Nytt HCP:", newHCP);

    if (!userId || course.trim() === "" || score === "" || newHCP === "") {
      setMessage("Alla fält måste fyllas i!");
      return;
    }

    const response = await registerRound(userId, course, Number(score), Number(newHCP));
    setMessage(response.message || "Rond registrerad!");

    // Rensa fälten efter registrering
    setCourse("");
    setScore("");
    setNewHCP("");

    fetchRounds(); // Uppdatera listan med ronder
  };

  return (
    <div className="register-round-container">
      <h1>Registrera Rond</h1>

      <form onSubmit={handleRegisterRound}>
        <input
          type="text"
          placeholder="Golfbana"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Antal slag"
          value={score}
          onChange={(e) => setScore(e.target.value ? Number(e.target.value) : "")}
          required
        />
        <input
          type="number"
          placeholder="Nytt HCP"
          value={newHCP}
          onChange={(e) => setNewHCP(e.target.value ? Number(e.target.value) : "")}
          required
        />
        <button type="submit">Registrera</button>
      </form>

      <p>{message}</p>

      <h2>Senaste ronder</h2>
      {rounds.length > 0 ? (
        <ul>
          {rounds.map((round, index) => (
            <li key={index}>
              <strong>{round.Course}</strong> - {round.Score} slag - <span>HCP: {round.NewHCP}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Inga registrerade ronder ännu.</p>
      )}
    </div>
  );
};

export default RegisterRound;
