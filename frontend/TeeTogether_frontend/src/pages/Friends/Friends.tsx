import { useEffect, useState } from "react";
import { getFriends, acceptFriendRequest, removeFriend } from "../../api";
import { useNavigate } from "react-router-dom";
import "./Friends.css";

const Friends = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    if (!userId) return;
    const data = await getFriends(userId);
    setFriends(data.friends || []);
    setRequests(data.pendingRequests || []);
  };

  const handleAcceptRequest = async (friendId: string) => {
    if (!userId) return;
    await acceptFriendRequest(userId, friendId);
    setMessage("Vänförfrågan accepterad!");
    fetchFriends();
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!userId) return;
    await removeFriend(userId, friendId);
    setMessage("Vän borttagen!");
    fetchFriends();
  };

  return (
    <div className="friends-container">
      <h1>Mina Vänner</h1>

      <h2>Vänner</h2>
      <ul>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.UserId}>
              {friend.Username} - HCP: {friend.CurrentHCP}
              <button onClick={() => handleRemoveFriend(friend.UserId)}>❌ Ta bort</button>
            </li>
          ))
        ) : (
          <p>Du har inga vänner ännu.</p>
        )}
      </ul>

      <h2>Vänförfrågningar</h2>
      <ul>
        {requests.length > 0 ? (
          requests.map((request) => (
            <li key={request.UserId}>
              {request.Username} har skickat en förfrågan!
              <button onClick={() => handleAcceptRequest(request.UserId)}>✅ Acceptera</button>
            </li>
          ))
        ) : (
          <p>Inga vänförfrågningar just nu.</p>
        )}
      </ul>

      <p>{message}</p>
    </div>
  );
};

export default Friends;
