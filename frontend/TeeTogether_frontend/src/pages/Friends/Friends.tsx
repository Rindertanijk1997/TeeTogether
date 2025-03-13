import { useEffect, useState } from "react";
import "./Friends.css";

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

interface User {
  UserId: string;
  Username: string;
  City: string;
  Age: number;
  CurrentHCP: string;
}

interface FriendRequest {
  RequesterId: string;
  FriendId: string;
  Username: string;
  CurrentHCP: string;
}

function Friends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFriends, setShowFriends] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      const storedFriends = localStorage.getItem("friends");
      const storedUsers = localStorage.getItem("users");

      if (storedFriends) setFriends(JSON.parse(storedFriends));
      if (storedUsers) setUsers(JSON.parse(storedUsers));

      fetchFriends();
      fetchFriendRequests();
      fetchUsers();
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
      localStorage.setItem("friends", JSON.stringify(data));
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

      setFriendRequests(data);
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

      const filteredUsers = data.filter(
        (user: User) =>
          user.UserId !== userId &&
          !friends.some(friend => friend.UserId === user.UserId) &&
          !friendRequests.some(request => request.RequesterId === user.UserId)
      );

      setUsers(filteredUsers);
      localStorage.setItem("users", JSON.stringify(filteredUsers));
    } catch (error) {
      console.error("❌ Fel vid hämtning av användare:", error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      if (!friendId) {
        console.error("❌ Kan inte skicka vänförfrågan utan ett giltigt UserId.");
        return;
      }

      if (friends.some(friend => friend.UserId === friendId)) {
        console.warn("⚠️ Ni är redan vänner.");
        return;
      }

      if (friendRequests.some(request => request.RequesterId === friendId)) {
        console.warn("⚠️ Vänförfrågan har redan skickats.");
        return;
      }

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
      fetchFriendRequests();
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      console.error("❌ Fel vid skickande av vänförfrågan:", error);
    }
  };

  const acceptFriendRequest = async (friendId: string) => {
    try {
      if (!friendId) {
        console.error("❌ Kan inte acceptera vänförfrågan utan giltigt UserId.");
        return;
      }

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

      fetchFriends().then(() => {
        const newFriend = users.find(user => user.UserId === friendId);
        if (newFriend) {
          const updatedFriends = [...friends, newFriend];
          setFriends(updatedFriends);
          localStorage.setItem("friends", JSON.stringify(updatedFriends));
        }
      });

      fetchFriendRequests();
    } catch (error) {
      console.error("❌ Fel vid accepterande av vänförfrågan:", error);
    }
  };

  return (
    <div className="friends-container">
    <h2>Golfvänner</h2>

    <button onClick={() => setShowFriends(!showFriends)} className="toggle-button">
      {showFriends ? "Visa alla användare" : "Visa mina vänner"}
    </button>

    {showFriends ? (
      <>
        <h3>Mina vänner</h3>
        {friends.length > 0 ? (
          <ul>
            {friends.map((friend) => (
              <li key={friend.UserId} onClick={() => setSelectedUser(friend)}>
                {friend.Username} (HCP: {friend.CurrentHCP})
              </li>
            ))}
          </ul>
        ) : (
          <p>Du har inga vänner ännu.</p>
        )}

        <h3>Vänförfrågningar</h3>
        {friendRequests.length > 0 ? (
          <ul>
            {friendRequests.map((req) => (
              <li key={req.RequesterId}>
                {req.Username} (HCP: {req.CurrentHCP})
                <button onClick={() => acceptFriendRequest(req.RequesterId)}>✔</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Inga vänförfrågningar.</p>
        )}
      </>
    ) : (
      <>
        <h3>Hitta golfvänner</h3>
        <input
          type="text"
          placeholder="Sök efter namn eller stad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="users-list">
          {users.map((user) => (
            <div key={user.UserId} className="user-card" onClick={() => setSelectedUser(user)}>
              <p><strong>{user.Username}</strong></p>
              <p>{user.City}, {user.Age} år</p>
              <p>HCP: {user.CurrentHCP}</p>
            </div>
          ))}
        </div>
      </>
    )}

{selectedUser && (
        <div className="overlay">
          <div className="overlay-content">
            <h3>{selectedUser.Username}</h3>
            <p><strong>Stad:</strong> {selectedUser.City}</p>
            <p><strong>Ålder:</strong> {selectedUser.Age}</p>
            <p><strong>HCP:</strong> {selectedUser.CurrentHCP}</p>

            {!friends.some(friend => friend.UserId === selectedUser.UserId) && (
              <button onClick={() => sendFriendRequest(selectedUser.UserId)}>➕ Lägg till vän</button>
            )}
            <button onClick={() => setSelectedUser(null)} className="close-button">✖ Stäng</button>
          </div>
        </div>
      )}
  </div>
  );
}

export default Friends;
