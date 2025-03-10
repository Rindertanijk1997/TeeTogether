import { useState } from "react";
import { loginUser } from "../../api";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await loginUser(username, password);
    if (response.token) {
      localStorage.setItem("token", response.token); // Spara token
      navigate("/dashboard"); // Skicka användaren vidare till dashboard
    } else {
      setMessage(response.error || "Inloggning misslyckades");
    }
  };

  return (
    <div className="login-container">
      <h1>Logga in</h1>
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
      <button onClick={handleLogin}>Logga in</button>
      <p>{message}</p>
    </div>
  );
};

export default Login;
