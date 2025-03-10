import { useEffect, useState } from "react";
import { getUsers, sendFriendRequest, acceptFriendRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = "pwTR"; // Ändra så att det hämtas från localStorage eller backend

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  const handleSendRequest = async (friendId: string) => {
    const response = await sendFriendRequest(userId, friendId);
    setMessage(response.message || "Förfrågan skickad!");
  };

  const handleAcceptRequest = async (friendId: string) => {
    const response = await acceptFriendRequest(userId, friendId);
    setMessage(response.message || "Vän accepterad!");
  };

  return (
    <div className="dashboard-container">
      <h1>Välkommen till TeeTogether</h1>
      <button onClick={() => navigate("/login")}>Logga ut</button>

      <h2>Alla användare</h2>
      <ul>
        {users.map((user) => (
          <li key={user.UserId}>
            {user.Username} - HCP: {user.CurrentHCP}
            <button onClick={() => handleSendRequest(user.UserId)}>Lägg till vän</button>
            <button onClick={() => handleAcceptRequest(user.UserId)}>Acceptera vänförfrågan</button>
          </li>
        ))}
      </ul>

      <p>{message}</p>
    </div>
  );
};

export default Dashboard;
