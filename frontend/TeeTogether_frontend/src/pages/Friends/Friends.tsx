import { useEffect, useState } from "react";
import "./Friends.css";

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

interface User {
  FriendId: string;
  UserId: string;
  Username: string;
  CurrentHCP: string;
  CreatedAt?: string;
}

interface FriendRequest {
  RequesterId: string;
  FriendId: string;
  Username: string;
  CurrentHCP: string;
  CreatedAt: string;
}

function Friends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showFriends, setShowFriends] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchFriends().then(() => {
        fetchUsers();
      });
      fetchFriendRequests();
    }
  }, [userId]);
  

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/friends?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Kunde inte hämta vänner.");
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("❌ Fel vid hämtning av vänner:", error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      console.log("🔍 Hämtar vänförfrågningar...");
      const response = await fetch(`${BACKEND_URL}/friends/search?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) throw new Error("Kunde inte hämta vänförfrågningar.");
  
      const data = await response.json();
      console.log("📌 API-svar för vänförfrågningar:", data);
  
      if (!Array.isArray(data)) {
        console.warn("⚠️ Ovänat format på data, förväntade en array.");
        return;
      }
  
      console.log("🛠 Före state update, rådata:", data);
  
      setFriendRequests(data); // Direkt sätta hela arrayen
    } catch (error) {
      console.error("❌ Fel vid hämtning av vänförfrågningar:", error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      console.log("🔄 Hämtar användare...");
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Kunde inte hämta användare.");
      const data = await response.json();
  
      console.log("📌 Alla användare från API:", data);
      console.log("📌 Mina vänner:", friends);
  
      // ✅ Filtrera bort befintliga vänner och användaren själv
      const filteredUsers = data.filter((user: User) => {
        const isFriend = friends.some(
          (friend) => friend.FriendId === user.UserId || friend.UserId === user.UserId
        );
        return user.UserId !== userId && !isFriend;
      });
  
      console.log("📌 Potentiella vänner efter filtrering:", filteredUsers);
      setUsers(filteredUsers);
    } catch (error) {
      console.error("❌ Fel vid hämtning av användare:", error);
    }
  };
  

  console.log("📝 Renderar vänförfrågningar:", friendRequests);

  const sendFriendRequest = async (friendId?: string) => {
    if (!friendId) {
      console.error("❌ Kan inte skicka vänförfrågan utan ett giltigt UserId.");
      return;
    }
  
    try {
      console.log("📌 Skickar vänförfrågan till:", friendId);
      const response = await fetch(`${BACKEND_URL}/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, friendId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kunde inte skicka vänförfrågan.");
      }
  
      console.log("✅ Vänförfrågan skickad!");
      fetchFriendRequests(); // Uppdatera listan med vänförfrågningar
      fetchUsers(); // Uppdatera listan med potentiella vänner
    } catch (error) {
      console.error("❌ Fel vid skickande av vänförfrågan:", error);
    }
  };
  

  const acceptFriendRequest = async (friendId: string) => {
    try {
      console.log("📌 Accepterar vänförfrågan från:", friendId);
      const response = await fetch(`${BACKEND_URL}/friends/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, friendId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Något gick fel vid acceptans av vänförfrågan.");
      }

      console.log("✅ Vänförfrågan accepterad!");
      fetchFriends(); // Uppdatera vänlistan
      fetchFriendRequests(); // Ta bort den från förfrågningar
    } catch (error) {
      console.error("❌ Fel vid accepterande av vänförfrågan:", error);
    }
  };

  return (
    <div className="friends-container">
      <h2>Vänner</h2>

      <button onClick={() => setShowFriends(!showFriends)} className="toggle-button">
        {showFriends ? "Visa vänförfrågningar" : "Visa vänner"}
      </button>

      {showFriends ? (
        <div>
          <h3>Mina vänner</h3>
          {friends.length > 0 ? (
            <ul>
              {friends.map((friend) => (
                <li key={`friend-${friend.UserId}`}>
                  {friend.Username} (HCP: {friend.CurrentHCP})
                </li>
              ))}
            </ul>
          ) : (
            <p>Du har inga vänner ännu.</p>
          )}
        </div>
      ) : (
        <div>
         <h3>Vänförfrågningar</h3>
{friendRequests.length > 0 ? (
  <ul>
    {friendRequests.map((req) => (
      <li key={`request-${req.RequesterId}`}>
        {req.Username} (HCP: {req.CurrentHCP})
        <button onClick={() => acceptFriendRequest(req.RequesterId)}>✔</button>
      </li>
    ))}
  </ul>
) : (
  <p>Inga vänförfrågningar.</p>
)}


          <h3>Hitta golfvänner</h3>
          {users.length > 0 ? (
            <ul>
              {users.map((user) => (
                <li key={`user-${user.UserId}`}>
                  {user.Username} (HCP: {user.CurrentHCP})
                  <button onClick={() => sendFriendRequest(user.UserId)}>➕</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Inga tillgängliga användare.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Friends;
