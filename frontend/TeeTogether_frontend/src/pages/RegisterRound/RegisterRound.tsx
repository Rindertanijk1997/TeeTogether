import { useState } from "react";
import "./registerRound.css";

const RegisterRound = () => {
  const [course, setCourse] = useState("");
  const [score, setScore] = useState("");
  const [newHCP, setNewHCP] = useState("");
  const userId = localStorage.getItem("userId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/registerRound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, course, score, newHCP }),
    });

    if (response.ok) {
      alert("Rond registrerad!");
      setCourse("");
      setScore("");
      setNewHCP("");
    } else {
      alert("Något gick fel.");
    }
  };

  return (
    <div className="register-round-container">
      <h2>Registrera Rond</h2>
      <form onSubmit={handleSubmit}>
        <label>Bana:</label>
        <input type="text" value={course} onChange={(e) => setCourse(e.target.value)} required />

        <label>Poäng:</label>
        <input type="number" value={score} onChange={(e) => setScore(e.target.value)} required />

        <label>Nytt HCP:</label>
        <input type="number" step="0.1" value={newHCP} onChange={(e) => setNewHCP(e.target.value)} required />

        <button type="submit">Registrera</button>
      </form>
    </div>
  );
};

export default RegisterRound;
