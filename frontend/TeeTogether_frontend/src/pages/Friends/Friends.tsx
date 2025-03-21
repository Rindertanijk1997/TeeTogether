import { useEffect, useState } from "react";
import FriendList from "../../components/FriendList/FriendList";
import FriendRequests from "../../components/FriendRequests/FriendRequests";
import UserList from "../../components/UserList/UserList";
import UserOverlay from "../../components/UserOverlay/UserOverlay";
import "./Friends.css";
import { AnimatePresence, motion } from "framer-motion";

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
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  const token = localStorage.getItem("token") || "";
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (userId) {
      loadLocalStorage();
      fetchFriends().then(() => {
        fetchFriendRequests().then(() => {
          fetchUsers();
        });
      });
    }
  }, [userId]);

  const loadLocalStorage = () => {
    const storedFriends = localStorage.getItem("friends");
    const storedRequests = localStorage.getItem("friendRequests");
    const storedUsers = localStorage.getItem("users");

    if (storedFriends) setFriends(JSON.parse(storedFriends));
    if (storedRequests) setFriendRequests(JSON.parse(storedRequests));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
  };

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
      const response = await fetch(`${BACKEND_URL}/friends/search?userId=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Kunde inte hämta vänförfrågningar.");
      const data = await response.json();
      setFriendRequests(data);
      localStorage.setItem("friendRequests", JSON.stringify(data));
    } catch (error) {
      console.error("❌ Fel vid hämtning av vänförfrågningar:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Kunde inte hämta användare.");
      const data = await response.json();

      const updatedFriends = JSON.parse(localStorage.getItem("friends") || "[]");
      const updatedRequests = JSON.parse(localStorage.getItem("friendRequests") || "[]");

      const filteredUsers = data.filter((user: User) => {
        const isFriend = updatedFriends.some((friend: User) => friend.UserId === user.UserId);
        const hasPendingRequest = updatedRequests.some((req: FriendRequest) => req.FriendId === user.UserId);
        return !isFriend && !hasPendingRequest && user.UserId !== userId;
      });

      setUsers(filteredUsers);
      localStorage.setItem("users", JSON.stringify(filteredUsers));
    } catch (error) {
      console.error("❌ Fel vid hämtning av användare:", error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      if (!friendId || sentRequests.includes(friendId)) return;

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
      setSentRequests((prev) => [...prev, friendId]);
      fetchFriendRequests();
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
  
      // 🟢 Uppdatera localStorage och state
      const updatedRequests = friendRequests.filter(req => req.RequesterId !== friendId);
      setFriendRequests(updatedRequests);
      localStorage.setItem("friendRequests", JSON.stringify(updatedRequests));
  
      const newFriend = users.find(user => user.UserId === friendId);
      if (newFriend) {
        const updatedFriends = [...friends, newFriend];
        setFriends(updatedFriends);
        localStorage.setItem("friends", JSON.stringify(updatedFriends));
      }
  
      fetchFriends(); // ✅ Hämta senaste vänner
      fetchFriendRequests(); // ✅ Hämta senaste förfrågningar
    } catch (error) {
      console.error("❌ Fel vid accepterande av vänförfrågan:", error);
    }
  };
  

  return (
    <motion.div className="friends-container">
    <motion.h1 className="friends-title">Vem tar du med dig ut på tee idag?</motion.h1>

    <motion.button 
      onClick={() => setShowFriends(!showFriends)}
      className="toggle-button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {showFriends ? "Visa alla golfare" : "Visa mina golfvänner"}
    </motion.button>

    <motion.div className="friends-content">
      {showFriends ? (
        <>
          <FriendList friends={friends} onSelect={setSelectedUser} />
          <FriendRequests friendRequests={friendRequests} onAccept={acceptFriendRequest} />
        </>
      ) : (
        <UserList 
          users={users} 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm} 
          onSelect={setSelectedUser} 
          onSendRequest={sendFriendRequest} 
          sentRequests={sentRequests}
        />
      )}
    </motion.div>

    <AnimatePresence>
      {selectedUser && (
        <UserOverlay
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSendRequest={sendFriendRequest}
          isFriend={friends.some(friend => friend.UserId === selectedUser.UserId)}
          sentRequests={sentRequests}
        />
      )}
    </AnimatePresence>
  </motion.div>
  );
}

export default Friends;
