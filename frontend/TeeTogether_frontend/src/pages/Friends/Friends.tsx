import { useEffect, useState } from "react";
import { getFriends } from "../../api";
import "./friends.css";

const Friends = () => {
  const [friends, setFriends] = useState<
    { FriendId: string; Username: string; CurrentHCP: number | string }[]
  >([]);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (userId) {
      fetchFriends();
    }
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const data = await getFriends(userId);
      console.log("📌 API-svar från backend:", data);
      setFriends(data);
    } catch (error) {
      console.error("❌ Fel vid hämtning av vänner:", error);
    }
  };

  return (
    <div className="friends-container">
      <h1>Mina vänner</h1>
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.FriendId}>
              <strong>{friend.Username || "Okänt namn"}</strong>
              <br />
              <small>HCP: {friend.CurrentHCP !== "Okänt" ? friend.CurrentHCP : "Okänt"}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Du har inga vänner ännu.</p>
      )}
    </div>
  );
};

export default Friends;
