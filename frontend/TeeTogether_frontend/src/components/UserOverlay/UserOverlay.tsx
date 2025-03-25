import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./UserOverlay.css";

const BACKEND_URL = "https://w9h1wx1u7l.execute-api.eu-north-1.amazonaws.com";

interface Round {
  Score: number;
  Course: string;
  NewHCP: number;
  Date: string;
}

interface User {
  UserId: string;
  Username: string;
  City: string;
  Age: number;
  CurrentHCP: string;
}

interface UserOverlayProps {
  user: User;
  onClose: () => void;
  onSendRequest: (friendId: string) => void;
  isFriend: boolean;
  sentRequests: string[];
}

function UserOverlay({ user, onClose, onSendRequest, isFriend, sentRequests }: UserOverlayProps) {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchRounds(user.UserId);
    }
  }, [user]);

  const fetchRounds = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/rounds?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setRounds(data.slice(-3)); 
      } else {
        throw new Error("Kunde inte hämta rundor.");
      }
    } catch (err) {
      setError("Kunde inte hämta rundor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="overlay-background" onClick={onClose}></div>
    <motion.div 
  className="user-overlay"
  initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
  exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
  transition={{ duration: 0.3 }}
>

      <button className="close-overlay" onClick={onClose}>&times;</button>

      <div className="overlay-header">
        <h2>{user.Username}</h2>
        <p className="user-info">{user.City}, {user.Age} år</p>
        <p className="user-hcp"><strong>HCP:</strong> {user.CurrentHCP}</p>
      </div>

      <div className="rounds-section">
        <h3>Senaste Golf-Rundor</h3>
        {loading ? (
          <p className="loading-text">Laddar...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : rounds.length > 0 ? (
          <ul className="round-list">
            {rounds.map((round, index) => (
              <motion.li 
                key={index}
                className="round-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <span className="round-date">{new Date(round.Date).toLocaleDateString()}</span>
                <span className="round-course">⛳ {round.Course}</span>
                <span className="round-score">🏌️‍♂️ {round.Score} Poäng</span>
                <span className="round-hcp">🎯 HCP: {round.NewHCP}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="no-rounds-text">Inga registrerade ronder.</p>
        )}
      </div>

      {!isFriend && !sentRequests.includes(user.UserId) && (
        <button className="send-request" onClick={() => onSendRequest(user.UserId)}>
          Lägg till vän
        </button>
      )}

      {sentRequests.includes(user.UserId) && (
        <button className="sent-request" disabled>
          Förfrågan skickad
        </button>
      )}

    </motion.div>
  </>
  );
}

export default UserOverlay;
