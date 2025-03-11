import { useEffect, useState } from "react";
import "./Friends.css";

interface Friend {
  FriendId: string;
  Username: string;
  City: string;
  Age: number;
  CurrentHCP: number;
}

interface User {
  UserId: string;
  Username: string;
  City: string;
  Age: number;
  CurrentHCP: number;
}

const Friends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [requestedFriends, setRequestedFriends] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (!userId) return;

    fetch(`https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/friends?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setFriends(data))
      .catch((error) => console.error("Fel vid hämtning av vänner:", error));

    fetch("https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Fel vid hämtning av användare:", error));

    const storedRequests = JSON.parse(localStorage.getItem("requestedFriends") || "[]");
    setRequestedFriends(storedRequests);
  }, [userId]);

  const sendFriendRequest = async (friendId: string) => {
    if (requestedFriends.includes(friendId)) {
      setErrorMessage("Du har redan skickat en vänförfrågan till denna person.");
      return;
    }

    if (!userId) {
      setErrorMessage("Fel: Användare är inte inloggad.");
      return;
    }

    try {
      const response = await fetch("https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, friendId: friendId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Okänt fel vid skickning av vänförfrågan.");
        return;
      }

      setRequestedFriends((prev) => {
        const updatedRequests = [...prev, friendId];
        localStorage.setItem("requestedFriends", JSON.stringify(updatedRequests));
        return updatedRequests;
      });
    } catch (error) {
      setErrorMessage("Nätverksfel vid skickning av vänförfrågan.");
    }
  };

  return (
    <div className="friends-container">
      <h2>Mina Vänner</h2>
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend.FriendId} className="friend-card">
            <p><strong>Namn:</strong> {friend.Username}</p>
            <p><strong>Stad:</strong> {friend.City}</p>
            <p><strong>Ålder:</strong> {friend.Age}</p>
            <p><strong>HCP:</strong> {friend.CurrentHCP}</p>
          </div>
        ))}
      </div>

      <h2>Alla Golfare</h2>
      <div className="users-list">
        {users.filter(user => user.UserId !== userId).map((user) => (
          <div key={user.UserId} className="user-card">
            <p><strong>Namn:</strong> {user.Username}</p>
            <p><strong>Stad:</strong> {user.City}</p>
            <p><strong>Ålder:</strong> {user.Age}</p>
            <p><strong>HCP:</strong> {user.CurrentHCP}</p>
            <button 
              onClick={() => sendFriendRequest(user.UserId)}
              style={{ backgroundColor: requestedFriends.includes(user.UserId) ? "green" : "black", color: "white" }}
              disabled={requestedFriends.includes(user.UserId)}
            >
              {requestedFriends.includes(user.UserId) ? "Förfrågan skickad" : "Lägg till vän"}
            </button>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div className="overlay">
          <div className="error-popup">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage(null)}>Stäng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Friends;
