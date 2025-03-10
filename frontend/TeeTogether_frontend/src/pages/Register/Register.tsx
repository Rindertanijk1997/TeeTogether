import { useState } from "react";
import { registerUser } from "../../api";
import { useNavigate } from "react-router-dom";
import "./register.css"; // Koppla CSS-filen

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState(0);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const response = await registerUser(username, password, city, age);
    if (response.message) {
      setMessage(response.message);
      navigate("/login"); // Skicka användaren till login efter registrering
    } else {
      setMessage("Registrering misslyckades");
    }
  };

  return (
    <div className="register-container">
      <h1>Registrera dig</h1>
      <input
        placeholder="Användarnamn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Lösenord"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        placeholder="Stad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        placeholder="Ålder"
        type="number"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
      />
      <button onClick={handleRegister}>Registrera</button>
      <p>{message}</p>
      <p>Har du redan ett konto? <a href="/login">Logga in här</a></p>
    </div>
  );
};

export default Register;
