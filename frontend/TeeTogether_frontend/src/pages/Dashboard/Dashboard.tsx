import { useEffect, useState } from "react";
import { getUsers, sendFriendRequest, acceptFriendRequest, searchGolfFriends } from "../../api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      console.error("🚨 Ingen användare inloggad, omdirigerar till login.");
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchFriends();
  }, [userId]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("🚨 Fel vid hämtning av användare:", error);
    }
  };
  const fetchFriends = async () => {
    if (!userId) return;
  
    try {
      const data = await searchGolfFriends(userId);
      console.log("📌 API-svar för vänförfrågningar:", data);
  
      if (data && data.pendingRequests) {
        // 🔹 Filtrera bort dubbletter baserat på FriendId
        const uniqueRequests = data.pendingRequests.filter(
          (request: { FriendId: any; }, index: any, self: any[]) =>
            index === self.findIndex((r) => r.FriendId === request.FriendId)
        );
  
        console.log("✅ Unika pending förfrågningar:", uniqueRequests);
        setPendingRequests(uniqueRequests);
      } else {
        console.log("❌ Ingen pending vänförfrågan hittades");
        setPendingRequests([]);
      }
  
      setFriends(data.friends || []);
    } catch (error) {
      console.error("🚨 Fel vid hämtning av vänner:", error);
    }
  };
  
  
  
  const handleSendRequest = async (friendId: string) => {
    if (!userId) {
      console.error("🚨 Ingen användare inloggad.");
      return;
    }

    try {
      const response = await sendFriendRequest(userId, friendId);
      console.log("📌 Vänförfrågan skickad:", response);
      setMessage(response.message || "Vänförfrågan skickad!");
      fetchFriends(); // Uppdatera listan
    } catch (error) {
      console.error("🚨 Fel vid skickande av vänförfrågan:", error);
    }
  };

  const handleAcceptRequest = async (friendId: string) => {
    if (!userId) return;
    try {
      const response = await acceptFriendRequest(userId, friendId);
      setMessage(response.message || "Vänförfrågan accepterad!");
      fetchFriends(); // Uppdatera listan efter att en vänförfrågan har accepterats
    } catch (error) {
      console.error("🚨 Fel vid accepterande av vänförfrågan:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Välkommen till TeeTogether</h1>
      <button
        onClick={() => {
          localStorage.removeItem("userId");
          navigate("/login");
        }}
      >
        Logga ut
      </button>

      <h2>Vänförfrågningar</h2>
<ul>
  {pendingRequests.length > 0 ? (
    pendingRequests.map((request) => (
      <li key={request.RequesterId}>
        {request.FriendId} har skickat en förfrågan!
        <button onClick={() => handleAcceptRequest(request.FriendId)}>Acceptera</button>
      </li>
    ))
  ) : (
    <p>❌ Inga vänförfrågningar just nu.</p>
  )}
</ul>



      <h2>Alla användare</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.UserId}>
              {user.Username} - HCP: {user.CurrentHCP || "?"}
              <button onClick={() => handleSendRequest(user.UserId)}>Lägg till vän</button>
            </li>
          ))
        ) : (
          <p>Inga användare hittades.</p>
        )}
      </ul>

      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
