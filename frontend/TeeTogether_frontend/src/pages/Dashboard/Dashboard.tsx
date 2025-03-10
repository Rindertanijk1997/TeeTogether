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
  const userId = localStorage.getItem("userId"); // Hämta från localStorage

  useEffect(() => {
    fetchUsers();
    fetchFriends();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const fetchFriends = async () => {
    if (!userId) return;
    const data = await searchGolfFriends(userId);
    setFriends(data.friends || []);
    setPendingRequests(data.pendingRequests || []);
  };

  const handleSendRequest = async (friendId: string) => {
    if (!userId) return;
    const response = await sendFriendRequest(userId, friendId);
    setMessage(response.message || "Förfrågan skickad!");
    fetchFriends(); // Uppdatera listan efteråt
  };

  const handleAcceptRequest = async (friendId: string) => {
    if (!userId) return;
    const response = await acceptFriendRequest(userId, friendId);
    setMessage(response.message || "Vänförfrågan accepterad!");
    fetchFriends();
  };

  return (
    <div className="dashboard-container">
      <h1>Välkommen till TeeTogether</h1>
      <button onClick={() => {
        localStorage.removeItem("userId");
        navigate("/login");
      }}>
        Logga ut
      </button>

      <h2>Dina vänner</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.UserId}>
              {friend.Username} - HCP: {friend.CurrentHCP}
            </li>
          ))
        ) : (
          <p>Du har inga golfvänner ännu.</p>
        )}
      </ul>

      <h2>Vänförfrågningar</h2>
      <ul>
        {pendingRequests.length > 0 ? (
          pendingRequests.map((request) => (
            <li key={request.UserId}>
              {request.Username} har skickat en förfrågan!
              <button onClick={() => handleAcceptRequest(request.UserId)}>Acceptera</button>
            </li>
          ))
        ) : (
          <p>Inga vänförfrågningar just nu.</p>
        )}
      </ul>

      <h2>Alla användare</h2>
      <ul>
        {users.map((user) => (
          <li key={user.UserId}>
            {user.Username} - HCP: {user.CurrentHCP}
            <button onClick={() => handleSendRequest(user.UserId)}>Lägg till vän</button>
          </li>
        ))}
      </ul>

      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
