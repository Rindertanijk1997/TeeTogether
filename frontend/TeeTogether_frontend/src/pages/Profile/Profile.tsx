import { useState, useEffect } from "react";
import "./profile.css";

interface ProfileProps {
  setIsAuthenticated: (isAuth: boolean) => void;
}

const Profile = ({ setIsAuthenticated }: ProfileProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "", age: "", city: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetch(`https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/friends/search?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setFriendsRequests(data.pendingRequests))
        .catch((error) => console.error("Fel vid hämtning av vänförfrågningar:", error));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isLogin
      ? "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/login"
      : "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/users/register";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      alert(isLogin ? "Inloggning lyckades!" : "Konto skapat!");
      if (isLogin) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        setIsAuthenticated(true);
        setIsLoggedIn(true);
      }
    } else {
      alert(data.error || "Något gick fel.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setIsLoggedIn(false);
  };

  const acceptFriendRequest = async (friendId: string) => {
    const userId = localStorage.getItem("userId");

    const response = await fetch("https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/friends/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId }),
    });

    if (response.ok) {
      alert("Vänförfrågan accepterad!");
      setFriendsRequests(friendsRequests.filter((req: any) => req.FriendId !== friendId));
    } else {
      alert("Något gick fel.");
    }
  };

  return (
    <div className="profile-container">
      {isLoggedIn ? (
        <button onClick={handleLogout}>Logga ut</button>
      ) : (
        <>
          <h2>{isLogin ? "Logga in" : "Registrera"}</h2>
          <form onSubmit={handleSubmit}>
            <label>Namn:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />

            <label>Lösenord:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />

            {!isLogin && (
              <>
                <label>Ålder:</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required />

                <label>Stad:</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </>
            )}

            <button type="submit">{isLogin ? "Logga in" : "Skapa konto"}</button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
            {isLogin ? "Registrera istället" : "Har redan ett konto? Logga in"}
          </button>
        </>
      )}

      {friendsRequests.length > 0 && (
        <div className="friend-requests">
          <h3>Vänförfrågningar</h3>
          {friendsRequests.map((req: any) => (
            <button key={req.FriendId} onClick={() => acceptFriendRequest(req.FriendId)}>Acceptera {req.Username}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;